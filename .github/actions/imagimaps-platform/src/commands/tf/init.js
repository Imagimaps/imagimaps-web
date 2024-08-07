// @ts-check
'use strict';

import { exec } from '@actions/exec';
import { getGlobalConfig } from '../../config.js';
import { backendConfig } from './backend.js';

/**
 * Initializes Terraform in the specified directory.
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const init = async (tfWorkDir) => {
  const {
    tf: { engine: tfEngine },
    aws: { region, accessKeyId, secretAccessKey, sessionToken }
  } = getGlobalConfig();

  const tfBackedVars = backendConfig().asInlineString();

  await exec(`${tfEngine} init ${tfBackedVars}`, [], {
    cwd: tfWorkDir,
    env: {
      AWS_REGION: region,
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
      AWS_SESSION_TOKEN: sessionToken,
    }
  });
};

export { init };
