// @ts-check
/**
 * Represents an instance of Terraform with a set of AWS Credentials.
 * @class TF
 */
'use strict';

import { exec } from '@actions/exec';

class TF {
  /**
   * @constructor
   * @param {Object} opts - The options for the Terraform command.
   * @param {string} [opts.engine='terraform'] - The engine to use for the Terraform command.
   * @param {string} [opts.workdir='.'] - The working directory for the Terraform command.
   * @param {Object} opts.awsContext - The AWS context for the Terraform command.
   * @param {string} opts.awsContext.region - The AWS region for the Terraform command.
   * @param {string} opts.awsContext.accessKeyId - The AWS access key ID for the Terraform command.
   * @param {string} opts.awsContext.secretAccessKey - The AWS secret access key for the Terraform command.
   * @param {string} opts.awsContext.sessionToken - The AWS session token for the Terraform command.
   * @throws {Error} Throws an error if AWS context is not provided.
   */
  constructor(opts) {
    this.engine = opts?.engine || process.env.TF_ENGINE || 'terraform';
    this.workdir = opts?.workdir || '.';
    this.awsContext = opts?.awsContext || {};

    if (!this.awsContext) {
      throw new Error('AWS Context Required');
    }
    this.awsCredentials = {
      AWS_REGION: this.awsContext.region,
      AWS_ACCESS_KEY_ID: this.awsContext.accessKeyId,
      AWS_SECRET_ACCESS_KEY: this.awsContext.secretAccessKey,
      AWS_SESSION_TOKEN: this.awsContext.sessionToken,
    };
  }

  /**
   * Initializes the Terraform project.
   *
   * @param {string} projectName - The name of the project.
   * @param {string} moduleType - The type of the module.
   * @param {string} moduleName - The name of the module.
   * @returns {Promise<void>} - A promise that resolves when the initialization is complete.
   */
  async init(projectName, moduleType, moduleName) {
    console.log(`Running Terraform init at ${this.workdir}`);
    const { region, accountId, accessKeyId, secretAccessKey, sessionToken } = this.awsContext;

    const tfBackendVars = [
      `-backend-config="region=${region}"`,
      `-backend-config="bucket=tf-state-${region}-${accountId}"`,
      `-backend-config="key=${projectName}/${moduleType}/${moduleName}/terraform.tfstate"`,
      `-backend-config="dynamodb_table=tf-state-lock-${region}-${accountId}"`,
    ].join(' ');

    await exec(
      `${this.engine} init ${tfBackendVars}`,
      ['-reconfigure'],
      {
        cwd: this.workdir,
        env: {
          ...process.env,
          ...this.awsCredentials,
        }
      }
    );
  }

  async workspace(project, environment, moduleType, moduleName, tfModule) {
    const workspaceId = `${project}-${environment}-${moduleType}-${moduleName}-${tfModule}`;
    console.log(`Selecting Terraform workspace ${workspaceId} at ${this.workdir}`);
    await exec(
      this.engine,
      ['workspace', 'select', '-or-create', workspaceId],
      {
        cwd: this.workdir,
        env: {
          ...process.env,
          ...this.awsCredentials,
        }
      }
    );
  }

  async plan(project, environment, moduleType, moduleName, inputs = {}) {
    const planfileName = `${moduleType}_${moduleName}.plan`;
    console.log(`Running Terraform plan at ${this.workdir}. Will output to ${planfileName}`);

    const commonInputs = [
      '-var',
      `aws_region=${this.awsCredentials.AWS_REGION}`,
      '-var',
      `project=${project}`,
      '-var',
      `environment=${environment}`,
    ];
    const optInputs = Object.entries(inputs).map(([key, value]) => ['-var', `${key}=${value}`]).flat();

    console.log('plan inputs', [...commonInputs, ...optInputs]);

    let hasChanges = true;
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
      cwd: this.workdir,
      env: {
        ...process.env,
        ...this.awsCredentials,
      }
    };

    await exec(
      this.engine,
      ['plan', ...commonInputs, ...optInputs, `-out=${planfileName}`],
      options
    );

    if (output.includes("Your infrastructure matches the configuration.")) {
      return "";
    }
    return planfileName;
  }

  async apply(planfileName) {
    console.log(`Running Terraform apply at ${this.workdir}`);
    await exec(
      this.engine,
      ['apply', planfileName],
      {
        cwd: this.workdir,
        env: {
          ...process.env,
          ...this.awsCredentials,
        }
      },
    );
  }

  async output() {
    console.log(`Running Terraform output at ${this.workdir}`);
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
      cwd: this.workdir,
      env: {
        ...process.env,
        ...this.awsCredentials,
      }
    };

    await exec(
      this.engine,
      ['output'],
      options
    );

    const lines = output.split('\n');
    const outputObject = {};
    for (const line of lines) {
      const [key, value] = line.split(' = ');
      if (key && value) {
        outputObject[key.trim()] = value.replace(/"/g, '').trim();
      }
    }

    return outputObject;
  }
}

export default TF;
