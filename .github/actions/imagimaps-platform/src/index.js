// @ts-check
'use strict';

import core from '@actions/core';
import {
  STSClient,
  AssumeRoleWithWebIdentityCommand,
} from '@aws-sdk/client-sts';
import fs from 'fs';

import {
  printActionHeader,
  printEnvVariables,
  printNodejsVariables,
} from './displays/index.js';
import { loadConfig } from './config.js';
import { commands } from './commands/index.js';
import { executor } from './action/index.js';
import Platform from './platform.js';
import AwsCredentials from './awsCredentials.js';
import Orchestrator from './orchestrator.js';

/**
 * The main function that executes the actions.
 * @returns {Promise<void>} A promise that resolves when the actions are completed.
 */
const main = async () => {
  const debug = core.isDebug();
  const localDev = !process.env.CI;
  const environment = core.getInput('environment');

  printActionHeader(debug);
  const globalConfig = await loadConfig(environment, debug);

  const awsCredsProvider = new AwsCredentials();
  // const awsAccountId = process.env.AWS_ACCOUNT_ID;
  // const credentials = await awsCredsProvider.authWithWebIdentity(awsAccountId, {
  //   debug,
  // });
  // globalConfig.aws.accessKeyId = credentials.AccessKeyId;
  // globalConfig.aws.secretAccessKey = credentials.SecretAccessKey;
  // globalConfig.aws.sessionToken = credentials.SessionToken;
  // console.log('AWS Credentials Expire:', credentials.Expiration);

  const shell = commands();
  const actionExec = executor(shell);

  const platform = new Platform({ ...globalConfig });
  const orchestrator = new Orchestrator({
    runtime: globalConfig.runtime,
    module: globalConfig.module,
    awsCredentialsProvider: awsCredsProvider,
  });

  const action = core.getInput('action');
  switch (action) {
    case 'build':
      await orchestrator.build().run();
      // await platform.buildModule();
      break;
    case 'deploy':
      await orchestrator.build().deploy().run();
      // await platform.deployModule();
      break;
    case 'destroy':
      console.warn('Destroy action is not yet implemented.');
      break;
    default:
      throw new Error(`Action "${action}" is not supported.`);
  }
};

main();
