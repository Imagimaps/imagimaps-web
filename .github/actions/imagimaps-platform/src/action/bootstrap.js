// @ts-check
'use strict';

import { getGlobalConfig } from '../config.js';

const bootstrapModule = async (shell) => {
  console.log('Bootstrapping module infrastructure...')
  const { module: { type: moduleType} } = getGlobalConfig();

  if (moduleType === 'service') {
    await bootstrapService(shell);
  } else {
    console.error('Module type unsupported:', moduleType);
  }
};

const bootstrapService = async (shell) => {
  const {
    runtime: { executionRoot },
    project: { name: projectName },
    environment: { name: environmentName },
    module: { name: moduleName, type: moduleType },
   } = getGlobalConfig();
  const tfShell = shell.tf(`${executionRoot}/../src/tf/ecr`);

  const planfileName = `${moduleType}_${moduleName}.plan`;

  await tfShell.init();
  await tfShell.selectWorkspace(`${projectName}-${environmentName}-${moduleType}-${moduleName}-ecr`);
  const hasChanges = await tfShell.plan(planfileName);
  if (hasChanges) {
    console.log('Changes detected, applying changes...');
    await tfShell.apply(planfileName);
  } else {
    console.log('No changes detected, skipping apply.');
  }
};

export {
  bootstrapModule
}
