'use strict';

import core from '@actions/core';
import github from '@actions/github';

import { setTfWorkspace } from './commands/setTfWorkspace.js';
import { planEcr } from './commands/planEcr.js';
import { applyTfPlan } from './commands/applyTfPlan.js';
import { getTfOutputs } from './commands/getTfOutputs.js';
import { dockerLoginToECR } from './commands/dockerLoginToEcr.js';
import { buildDockerContainer } from './commands/dockerBuild.js';
import { dockerPushToECR } from './commands/dockerPushToEcr.js';
import { readStreamToString } from './utils/stream.js';

let IS_LOCAL_DEV = false;
let ACTION_HOME = '/action';
let TF_ENGINE = 'tofu';

const milliseconds = milliseconds => milliseconds;
const seconds = seconds => seconds * 1000;
const minutes = minutes => seconds(minutes * 60);

function printHeader(contexts) {
  console.log('====================================');
  console.log('GitHub Action: Imagimaps Service');
  console.log('====================================');
  console.log('Context Checks');
  console.log('    AWS Account:', Boolean(contexts.aws.accountId));
  console.log('    AWS Key ID:', Boolean(contexts.aws.keyId));
  console.log('    AWS Secret:', Boolean(contexts.aws.secret));
  console.log('    AWS Region:', Boolean(contexts.aws.region));
  console.log('    Docker User:', Boolean(contexts.docker.user));
  console.log('    Docker Token:', Boolean(contexts.docker.token));

  const undefinedKeys = Object.entries(contexts).reduce((map, [key, value]) => {
    if (typeof value === 'object') {
      const undefinedProps = Object.entries(value).filter(
        ([propKey, propValue]) => propValue === undefined,
      );
      if (undefinedProps.length > 0) {
        map.set(
          key,
          undefinedProps.map(([propKey]) => propKey),
        );
      }
    }
    return map;
  }, new Map());

  console.log('====================================');
  if (undefinedKeys.size > 0) {
    console.error('Not enough information was provided to continue.');
    console.log('Please ensure the following environment variables are set:');
    for (const [key, props] of undefinedKeys) {
      console.log(`    ${key}: ${props.join(', ')}`);
    }
    throw new Error('Missing required environment variables.');
  }

  console.log('All required environment variables are set. Continuing...');
  console.log('Building and deploying service:', contexts.service.name);
  console.log('    at dir:', contexts.service.dir);
  console.log('Action HOME dir in local container:', ACTION_HOME);

  try {
    if (process.env.DEBUG) {
      console.log('All Envs', process.env);
    }
  } catch (err) {
    console.error('Error getting process.env:', err);
  }
}

async function getECRForService(contexts) {
  const {
    service: { name },
    runtime: { actionHome },
  } = contexts;
  console.log('Ensure ECR exists for service:', name);

  console.log(`Setting up OpenTofu workspace: ${name}`);
  await setTfWorkspace(`${name}`, contexts);

  await planEcr(name, contexts);
  await applyTfPlan(`${name}.plan`, contexts, `${actionHome}/tf`);
  const ecrContext = await getTfOutputs(contexts, `${actionHome}/tf`);

  const ecrUrl = ecrContext.repository_url.value;

  await core.summary
    .addHeading('ECR Parameters')
    .addTable([
      [{data: 'Parameter', header: true}, {data: 'Value', header: true}],
      ['Name', ecrContext.repository_name.value],
      ['ID', ecrContext.registry_id.value],
      ['URL', ecrContext.repository_url.value],
      ['ARN', ecrContext.arn.value],
    ])
    .write();

  return ecrContext;
}

async function main() {
  IS_LOCAL_DEV = process.env.LOCAL_RUN === 'true';
  ACTION_HOME = core.getInput('ACTION_HOME') || ACTION_HOME;
  TF_ENGINE = core.getInput('TF_ENGINE') || TF_ENGINE;

  const contexts = {
    aws: {
      accountId: process.env.AWS_ACCOUNT_NUMBER,
      keyId: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
    docker: {
      user: process.env.DOCKERHUB_USER,
      token: process.env.DOCKERHUB_TOKEN,
    },
    project: {
      name: 'imagimaps',
      environment: 'production',
    },
    runtime: {
      actionHome: IS_LOCAL_DEV ? './src' : ACTION_HOME,
      debug: core.isDebug(),
      tfEngine: TF_ENGINE,
      workspaceHome: process.env.GITHUB_WORKSPACE,
    },
    service: {
      dir: core.getInput('service_dir'),
      name: core.getInput('service_dir').split('/').pop(),
    },
  };

  printHeader(contexts);

  const { debug } = contexts.runtime;

  const ecrContext = await getECRForService(contexts);
  debug && console.log('ECR Context:', ecrContext);

  await dockerLoginToECR(ecrContext, contexts);

  const imageTags = ['latest'];
  await buildDockerContainer(
    contexts.service.name,
    imageTags,
    ecrContext,
    contexts,
  );
  await dockerPushToECR(imageTags, ecrContext, contexts);
}

main();
