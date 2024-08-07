'use strict';

import core from '@actions/core';

import { commands } from './commands/index.js';

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

/**
 * Main function for the service deploy action.
 * @returns {Promise<void>}
 */
async function main() {
  const IS_LOCAL_DEV = process.env.LOCAL_RUN === 'true';
  const ACTION_HOME = core.getInput('ACTION_HOME') || '/action';

  /**
   * The contexts object containing various context information.
   * @type {Contexts}
   */
  const contexts = {
    aws: {
      accountId: process.env.AWS_ACCOUNT_NUMBER,
      keyId: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
    project: {
      name: 'imagimaps',
      environment: 'production',
    },
    runtime: {
      actionHome: IS_LOCAL_DEV ? './src' : ACTION_HOME,
      debug: core.isDebug(),
      tfEngine: core.getInput('TF_ENGINE') || 'tofu',
      workspaceHome: process.env.GITHUB_WORKSPACE,
    },
    service: {
      dir: core.getInput('service_dir'),
      name: core.getInput('service_dir').split('/').pop(),
    },
  };

  const {
    runtime: { actionHome },
  } = contexts;

  const cmd = commands(contexts);
  const tf = cmd.tf(`${actionHome}/tf`);

  await tf.init();
  await tf.enableWorkspace('test');
  // ECR Repo Name - min:2, max: 256, pattern: [a-zA-Z0-9_-./]+
  await tf.plan([
    ['service_version', 'latest'],
    ['service_port', '8080'],
  ]);
}

main();
