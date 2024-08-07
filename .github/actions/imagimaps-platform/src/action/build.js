// @ts-check
'use strict';

import Docker from '../commands/docker.js';
import TF from '../commands/tf.js';
import ECR from '../commands/aws/ecr.js';
import { getGlobalConfig } from '../config.js';

const buildModule = async (shell) => {
  console.log('Building module...')
  const { module: { type: moduleType} } = getGlobalConfig();

  if (moduleType === 'service') {
    await buildService(shell);
  }
}

const buildService = async (shell) => {
  const {
    project: { name: projectName },
    environment: { name: environmentName },
    module: { name: serviceName, directory: serviceDir, type: moduleType},
    runtime: { workspaceDir, executionRoot },
    tf: { engine: tfEngine },
    aws
  } = getGlobalConfig();

  const tf = new TF({
    engine: tfEngine,
    workdir: `${executionRoot}/../src/tf/ecr`,
    awsContext: { ...aws }
  });
  const docker = new Docker({
    context: workspaceDir,
    workdir: workspaceDir
  });
  const ecr = new ECR({
    context: { ...aws }
  });

  await tf.init(projectName, moduleType, serviceName);
  await tf.workspace(projectName, environmentName, moduleType, serviceName, 'ecr');
  const { repository_url } = await tf.output();

  await docker.buildService(serviceName);
  await docker.tag(serviceName, [`${repository_url}:latest`]);

  const ecrPassword = await ecr.getLoginPassword();
  await docker.login(repository_url, ecrPassword);
  await docker.push(repository_url);
}

export {
  buildModule
}
