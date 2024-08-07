import { exec } from '@actions/exec';

const applyTfPlan = async (planfileDir, contexts, tfWorkDir = '.' ) => {
  const {
    runtime: { tfEngine },
  } = contexts;

  await exec(tfEngine, ['apply', planfileDir], {
    cwd: tfWorkDir,
  });
};

export { applyTfPlan };
