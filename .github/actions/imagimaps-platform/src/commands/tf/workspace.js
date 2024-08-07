import { exec } from '@actions/exec';

import { getGlobalConfig } from '../../config.js';

/**
 * Selects the Terraform Workspace in the specified directory.
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @param {string} workspaceId - Unique Workspace Identifier
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const workspace = async (tfWorkDir, workspaceId) => {
  const {
    tf: { engine: tfEngine },
    aws: { region, accessKeyId, secretAccessKey, sessionToken }
  } = getGlobalConfig();

  await exec(tfEngine, ['workspace',  'select', '-or-create', workspaceId], {
    cwd: tfWorkDir,
    env: {
      AWS_REGION: region,
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
      AWS_SESSION_TOKEN: sessionToken,
    }
  });
};

export { workspace };
