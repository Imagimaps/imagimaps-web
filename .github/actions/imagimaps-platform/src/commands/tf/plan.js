import { exec } from '@actions/exec';
import { getGlobalConfig } from '../../config.js';

/**
 * Plans the Terraform in the specified directory.
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @param {[string, string][] | undefined} inputs - List of inputs to be passed to Terraform.
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const plan = async (tfWorkDir, planfileName, inputs = []) => {
  const { aws, module, project, tf, runtime, environment } = getGlobalConfig();
  const { region, accessKeyId, secretAccessKey, sessionToken } = aws;
  const { name: projectName } = project;
  const { type: moduleType, name: moduleName } = module;
  const { engine: tfEngine } = tf;
  const { debug } = runtime;
  const { name: projectEnv } = environment;

  const commonInputs = [
    '-var',
    `aws_region=${region}`,
    '-var',
    `project=${projectName}`,
    '-var',
    `environment=${projectEnv}`,
    '-var',
    `module_name=${moduleName}`,
  ];
  const optInputs = inputs.map(([key, value]) => ['-var', `${key}=${value}`]).flat();

  console.log('plan inputs', [...commonInputs, ...optInputs]);

  let output = '';
  let error = '';

  const options = {
    listeners: {
      stdout: (data) => {
        output += data.toString();
      },
      stderr: (data) => {
        error += data.toString();
      }
    },
    cwd: tfWorkDir,
    env: {
      AWS_REGION: region,
      AWS_ACCESS_KEY_ID: accessKeyId,
      AWS_SECRET_ACCESS_KEY: secretAccessKey,
      AWS_SESSION_TOKEN: sessionToken,
    }
  };

  await exec(
    tfEngine,
    ['plan', ...commonInputs, ...optInputs, `-out=${planfileName}`],
    options
  );

  if (output.includes("Your infrastructure matches the configuration.")) {
    return false
  }
  return true
};

export { plan };
