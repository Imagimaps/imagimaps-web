import * as core from '@actions/core'
import { STSClient, AssumeRoleWithWebIdentityCommand } from '@aws-sdk/client-sts';

import CredentialsCache from './credentialsCache';
import CredentialsContext from './models/credentialsContext';

type AwsCredentialsOptions = {
  region?: string;
}

class AwsCredentials {
  region: string = 'ap-southeast-2';
  credentialsCache: CredentialsCache
  
  constructor(opts?: AwsCredentialsOptions) {
    this.region = opts?.region || this.region;
    this.credentialsCache = new CredentialsCache();
  }
  
  async authenticate(awsAccountId: string) {
    core.info(`Authenticating with AWS account ID: ${awsAccountId}`)

    if (!/^[0-9]{12}$/.test(awsAccountId)) {
      core.setFailed(`[${awsAccountId}] Is an invalid AWS account ID. Must be a 12 digit number.`);
    }

    const fromCache = this.credentialsCache.get(awsAccountId, this.region);
    if (fromCache) {
      core.info(`Using cached credentials for account ID: ${awsAccountId}`)
      core.debug(`Retrieved from cache: ${JSON.stringify(fromCache)}`)
      return fromCache;
    }

    const oidcIdToken = await core.getIDToken("sts.amazonaws.com");
    const params = {
      RoleArn: `arn:aws:iam::${awsAccountId}:role/imagimaps/automation/service-deploy-role`,
      RoleSessionName: 'platform-deploy-action',
      WebIdentityToken: oidcIdToken,
    };
    core.debug(`Assuming role with params: ${JSON.stringify(params)}`);

    try {
      const stsClient = new STSClient({ region: this.region });
      const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand(params));

      if (!Credentials) {
        core.setFailed(`Response yielded no credentials for account ID: ${awsAccountId}`);
        return Promise.reject(`Response yielded no credentials for account ID: ${awsAccountId}`);
      }

      const credentialsContext = new CredentialsContext(awsAccountId, this.region, Credentials!);
      this.credentialsCache.set(awsAccountId, this.region, credentialsContext);

      return credentialsContext;
    } catch (error) {
      core.setFailed(`Failed to retrieve credentials: ${error}`);
      return Promise.reject(`Failed to retrieve credentials for account ID: ${awsAccountId}`);
    }
  }
}

export default AwsCredentials;

