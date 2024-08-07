import { exec } from '@actions/exec';

/**
 * Plans the Terraform in the specified directory.
 * @param {Object} contexts - The execution contexts.
 * @param {Object} contexts.runtime - The runtime information.
 * @param {string} contexts.runtime.tfEngine - The Terraform engine command.
 * @param {Object} contexts.aws - AWS configuration
 * @param {string} contexts.aws.region - AWS region
 * @param {Object} contexts.project - Project configuration
 * @param {string} contexts.project.name - Project name
 * @param {string} contexts.project.environment - Project environment
 * @param {Object} contexts.service - Service configuration
 * @param {string} contexts.service.name - Service name
 * @param {string} tfWorkDir - The directory where Terraform should be initialized.
 * @param {[string, string][] | undefined} inputs - List of inputs to be passed to Terraform.
 * @returns {Promise<void>} - A promise that resolves when Terraform initialization is complete.
 */
const plan = async (contexts, tfWorkDir, inputs = []) => {
  const {
    runtime: { tfEngine },
    aws: { region },
    project: { name: projectName, environment: projectEnv },
    service: { name: serviceName },
  } = contexts;

  const commonInputs = [
    '-var',
    `aws_region=${region}`,
    '-var',
    `project=${projectName}`,
    '-var',
    `environment=${projectEnv}`,
    '-var',
    `service_name=${serviceName}`,
  ];
  const optInputs = inputs.map(([key, value]) => ['-var', `${key}=${value}`]).flat();

  console.log('plan inputs', [...commonInputs, ...optInputs]);
  await exec(
    tfEngine,
    ['plan', ...commonInputs, ...optInputs, `-out=service_${serviceName}.plan`],
    {
      cwd: tfWorkDir,
    },
  );
};

export { plan };

/**
 * @typedef {Object} Contexts
 * @property {Object} aws - AWS related configurations.
 * @property {string} aws.accountId - The AWS account ID/Number.
 * @property {string} aws.keyId - The AWS access key ID.
 * @property {string} aws.secret - The AWS secret access key.
 * @property {string} aws.region - The AWS region.
 * @property {Object} project - Project related configurations.
 * @property {string} project.name - The name of the project.
 * @property {string} project.environment - The environment of the project.
 * @property {Object} runtime - Runtime related configurations.
 * @property {string} runtime.actionHome - The action home directory.
 * @property {boolean} runtime.debug - Flag indicating if debug mode is enabled.
 * @property {string} runtime.tfEngine - The Terraform engine.
 * @property {string} runtime.workspaceHome - The workspace home directory.
 * @property {Object} service - Service related configurations.
 * @property {string} service.dir - The directory of the service.
 * @property {string} service.name - The name of the service.
 */
