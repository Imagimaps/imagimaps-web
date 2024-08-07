// @ts-check
'use strict';

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import core from '@actions/core';

import { deepMerge } from './utils/object.js';

/**
 * @typedef {Object} GlobalConfig
 * @property {Object} project - The project configuration.
 * @property {string} project.name - The name of the project.
 * @property {Object} runtime - The runtime configuration.
 * @property {string} runtime.executionRoot - The execution root.
 * @property {boolean} runtime.debug - Whether debug mode is enabled.
 * @property {Object} environment - The environment configuration.
 * @property {string} environment.name - The name of the environment.
 * @property {string} environment.shortname - The short name of the environment.
 * @property {Object} aws - The AWS configuration.
 * @property {string} aws.accountId - The AWS account ID.
 * @property {string} aws.region - The AWS region.
 * @property {string} aws.accessKeyId - The AWS access key ID.
 * @property {string} aws.secretAccessKey - The AWS secret access key.
 * @property {string} aws.sessionToken - The AWS web session token.
 * @property {Object} tf - The Terraform configuration.
 * @property {string} tf.engine - The Terraform engine.
 * @property {string} tf.remoteStateBucket - The remote state bucket.
 * @property {string} tf.stateLockTable - The state lock table.
 * @property {Object} module - The module configuration.
 * @property {string} module.directory - The module directory.
 * @property {string} module.name - The module name.
 * @property {string} module.type - The module type.
 */
let GLOBAL_CONFIG = {
  project: {
    name: 'NOT_SET',
  },
  runtime: {
    executionRoot: 'NOT_SET',
    workspaceDir: 'NOT_SET',
    debug: false,
  },
  environment: {
    name: 'NOT_SET',
    shortname: 'NOT_SET',
  },
  aws: {
    accountId: 'NOT_SET',
    region: 'NOT_SET',
    accessKeyId: 'NOT_SET',
    secretAccessKey: 'NOT_SET',
    sessionToken: 'NOT_SET',
  },
  tf: {
    engine: 'terraform',
    remoteStateBucket: 'NOT_SET',
    stateLockTable: 'NOT_SET',
  },
  module: {
    directory: 'NOT_SET',
    name: 'NOT_SET',
    type: 'NOT_SET',
  },
};

/**
 * Processes the inputs provided to the action and returns a configuration object.
 * @returns {Object} The processed configuration object.
 */
const processInputs = () => {
  const moduleDirectory = core.getInput('module_dir');

  let moduleType = null;
  if (/^services\/.*/.test(moduleDirectory)) {
    moduleType = 'service';
  } else if (/^apps\/.*/.test(moduleDirectory)) {
    moduleType = 'webapp';
  }

  if (!moduleType) {
    throw new Error(`Module type could not be inferred from directory: ${moduleDirectory}`);
  }

  const moduleName = moduleDirectory.split('/').pop();

  return {
    runtime: {
      debug: core.isDebug(),
    },
    module: {
      directory: moduleDirectory,
      name: moduleName,
      type: moduleType,
    },
  };
}

/**
 * Processes the environment variables and returns an environment configuration object.
 * @returns {Object} The processed environment configuration object.
 */
const processEnv = () => {
  return {
    aws: {
      accountId: process.env.AWS_ACCOUNT_ID,
      region: process.env.AWS_REGION,
    },
    tf: {
      engine: process.env.TF_ENGINE || 'terraform',
    },
  };
};

/**
 * Loads the cloudy configuration file and returns the platform configuration for the specified environment.
 * @param {string} executionRoot - The root directory of the execution.
 * @param {string} environment - The environment to load the configuration for.
 * @param {boolean} [debug=false] - Whether to enable debug mode.
 * @returns {Promise<Object>} A promise that resolves with the platform configuration.
 */
const loadCloudyConfig = async (executionRoot, environment, debug = false) => {
  const filePath = path.join(executionRoot, '..', 'cloudy.yml');
  let cloudyConfig = null;
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    cloudyConfig = yaml.load(fileContent);
    debug && console.debug('Parsed Content', JSON.stringify(cloudyConfig));
  } catch (error) {
    console.error(`Error loading ${filePath}`, error);
    return error;
  }

  const platformConfig = cloudyConfig.platform;
  const tfState = platformConfig.tf_state;
  const platformEnvConf = platformConfig.environments.find(env => env.name === environment);
  if (!platformEnvConf) {
    return new Error(`No configuration found for environment [${environment}]`);
  }

  return {
    project: cloudyConfig.project,
    tf: {
      remoteStateBucket: tfState.bucket_prefix,
      stateLockTable: tfState.lock_table_prefix,
    },
    environment: platformEnvConf
  };
}

/**
 * Loads the platform configuration for the specified environment.
 * @param {string} environment - The environment to load the configuration for.
 * @param {boolean} [debug=false] - Whether to enable debug mode.
 * @returns {Promise<Object>} A promise that resolves when the configuration is loaded.
 */
const loadConfig = async (environment, debug = false) => {
  console.log(`Loading platform configuration for [${environment}]...`);

  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const inputState = processInputs();
  const envState = processEnv();
  const cloudyState = await loadCloudyConfig(__dirname, environment, debug);

  let config = {};
  config = deepMerge(config, inputState);
  config = deepMerge(config, envState);
  config = deepMerge(config, cloudyState);
  config = deepMerge(config, {
    runtime: {
      executionRoot: __dirname,
      workspaceDir: process.env.GITHUB_WORKSPACE,
      debug,
    }
  });

  GLOBAL_CONFIG = Object.freeze(config);

  console.log(`Platform configuration for [${environment}] loaded`);
  debug && console.debug('Finalised Config:', '\n', GLOBAL_CONFIG);

  return Promise.resolve(GLOBAL_CONFIG);
};

/**
 * Returns the global configuration object.
 * @returns {Object} The global configuration object.
 */
const getGlobalConfig = () => GLOBAL_CONFIG;

export default GLOBAL_CONFIG;

export {
  loadConfig,
  getGlobalConfig,
};
