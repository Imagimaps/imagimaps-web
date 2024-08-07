import * as core from '@actions/core';

import AwsCredentials from '../../aws/awsCredentials';
import TF from '../../wrappers/tf';
import Module from '../models/module';
import PlatformActionable from './platformActionable';
import CredentialsContext from '../../aws/models/credentialsContext';

type TfFailure = {
  reason: string;
  module: string;
  action: 'init' | 'output';
};

class Service implements PlatformActionable {
  private platformModule: Module;
  private awsCredentials: AwsCredentials;

  private tfAccountMappings: Record<string, string> = {};
  
  private tfClients: Record<string, TF> = {};
  
  constructor(platformModule: Module, awsCredentials: AwsCredentials, options?: Record<string, any>) {
    this.platformModule = platformModule;
    this.awsCredentials = awsCredentials;

    this.tfAccountMappings = options?.tfAccountMappings || {
      ecr: process.env.ARTIFACTS_AWS_ACCOUNT_ID || 'NOT_SET',
    };
  }

  private async authToAWS(accounts: string[]): Promise<CredentialsContext[]> {
    const authPromises = accounts.map((account) => this.awsCredentials.authenticate(account));
    const authResults = await Promise.allSettled(authPromises);
    const failedAuths = authResults.filter((authResult) => authResult.status === 'rejected');
    core.debug(`Auth Results: ${JSON.stringify(authResults)}`);
    if (failedAuths.length > 0) {
      core.setFailed(`[❗] Failed to authenticate to AWS accounts: ${JSON.stringify(failedAuths)}`);
      return Promise.reject((failedAuths[0] as PromiseRejectedResult).reason);
    }
    return authResults.map((authResult) => (authResult as PromiseFulfilledResult<CredentialsContext>).value);
  }

  private setupTFClients(awsCredsCtx: CredentialsContext[]) {
    Object.entries(this.tfAccountMappings).map(([tfModule, awsAccountId]) => {
      const ctx = awsCredsCtx.find((awsCreds) => awsCreds.accountId === awsAccountId);
      core.debug(`Ctx Result: ${JSON.stringify(ctx)}`);
      if (!ctx) {
        core.setFailed(`[❗] Unable to find AWS credentials for account ${awsAccountId}`);
        return Promise.reject(`Unable to find AWS credentials for account ${awsAccountId}`);
      }
      this.tfClients[tfModule] = new TF(tfModule, this.platformModule, ctx);
    });
  }
  
  async checkDependentInfrastructure(): Promise<string[]> {
    const awsAccIds = Object.values(this.tfAccountMappings);
    const tfModules = Object.keys(this.tfAccountMappings);

    const awsAuthCtxs = await this.authToAWS(awsAccIds);
    this.setupTFClients(awsAuthCtxs);


    const tfInitAttempts = tfModules.map((tfModule) => this.tfClients[tfModule].init());
    const tfInitResults = await Promise.allSettled(tfInitAttempts);
    core.debug(`TF Init Results: ${JSON.stringify(tfInitResults)}`);
    const failedInits = tfInitResults.filter((initResult) => initResult.status === 'rejected');
    if (failedInits.length > 0) {
      core.setFailed(`[❗] Failed to init dependent infrastructure: ${JSON.stringify(failedInits)}`);
      return Promise.reject('Failed to init dependent infrastructure');
    }
    
    const outputAttempts = tfModules.map((tfModule) => this.tfClients[tfModule].output());
    const outputResults = await Promise.allSettled(outputAttempts);
    core.debug(`Output Results: ${JSON.stringify(outputResults)}`);

    const missingTf = outputResults.reduce((acc: string[], output) => {
      if (output.status === 'rejected') {
        const failure: TfFailure = (output as PromiseRejectedResult).reason;
        core.info(`[❌] ${failure.reason}`);
        acc.push(failure.module);
      } else {
        const success = (output as PromiseFulfilledResult<Record<string, any>>).value;
        core.debug(`Output: ${JSON.stringify(success)}`);
        core.info(`[✅] ${success} is ready.`);
      }
      return acc;
    }, []);

    const hasInitFailed = missingTf.filter((failure) => failure.startsWith('Tf init failed for'));
    if (hasInitFailed.length > 0) {
      core.info(`Failed to init dependent infrastructure: ${JSON.stringify(hasInitFailed)}`);
      return Promise.reject(missingTf);
    }

    return missingTf.map((failure) => failure);
  }

  deployDependencies(dependencies: string[]): Promise<void> {
    return Promise.resolve();
  }

  build(): Promise<void> {
    return Promise.resolve();
  }

  deploy(): Promise<void> {
    return Promise.resolve();
  }
}

export default Service;
