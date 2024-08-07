import { exec } from '@actions/exec';

/**
 * Initializes Terraform in the specified directory.
 * @param {Object} contexts - The execution contexts.
 * @param {Object} contexts.runtime - The runtime information.
 * @param {string} contexts.runtime.tfEngine - The Terraform engine command.
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const init = async (contexts, tfWorkDir) => {
  const {
    runtime: { tfEngine },
  } = contexts;
  await exec(tfEngine, ['init'], {
    cwd: tfWorkDir,
  });
};

export { init };
