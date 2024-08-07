import { exec } from '@actions/exec';

import { tfInit } from './tfInit.js';

const setTfWorkspace = async (workspaceKey, contexts) => {
  const {
    runtime: { actionHome, tfEngine },
  } = contexts;
  const ecrTfWorkDir = `${actionHome}/tf`;
  await tfInit(contexts);
  console.log(`Setting up OpenTofu workspace: ${workspaceKey}`);
  await exec(tfEngine, ['workspace', 'select', '-or-create', workspaceKey], {
    cwd: ecrTfWorkDir,
  });
};

export { setTfWorkspace };
