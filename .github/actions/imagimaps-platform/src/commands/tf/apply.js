import { exec } from '@actions/exec';
import { getGlobalConfig } from '../../config.js';

/**
 * Plans the Terraform in the specified directory.
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @param {[string, string][] | undefined} inputs - List of inputs to be passed to Terraform.
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const apply = async (tfWorkDir, planfileName) => {
  const { aws, tf } = getGlobalConfig();
  const { region, accessKeyId, secretAccessKey, sessionToken } = aws;
  const { engine: tfEngine } = tf;

  console.log(`Applying plan file: ${planfileName}`);
  await exec(
    tfEngine,
    ['apply', planfileName],
    {
      cwd: tfWorkDir,
      env: {
        AWS_REGION: region,
        AWS_ACCESS_KEY_ID: accessKeyId,
        AWS_SECRET_ACCESS_KEY: secretAccessKey,
        AWS_SESSION_TOKEN: sessionToken,
      }
    },
  );
};

export { apply };
