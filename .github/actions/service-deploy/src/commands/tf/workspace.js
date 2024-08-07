import { exec } from '@actions/exec';

/**
 * Selects the Terraform Workspace in the specified directory.
 * @param {Object} contexts - The execution contexts.
 * @param {Object} contexts.runtime - The runtime information.
 * @param {string} contexts.runtime.tfEngine - The Terraform engine command.
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @param {string} workspaceId - Unique Workspace Identifier
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const workspace = async (contexts, tfWorkDir, workspaceId) => {
  const {
    runtime: { tfEngine },
  } = contexts;
  await exec(tfEngine, ['workspace',  'select', '-or-create', workspaceId], {
    cwd: tfWorkDir,
  });
};

export { workspace };
