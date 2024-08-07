import { exec } from '@actions/exec';

const tfInit = async (contexts) => {
  const { runtime: { actionHome, tfEngine} } = contexts;
  const ecrTfWorkDir = `${actionHome}/tf`;
  await exec(tfEngine, ['init'], {
    cwd: ecrTfWorkDir,
  });
};

export { tfInit };
