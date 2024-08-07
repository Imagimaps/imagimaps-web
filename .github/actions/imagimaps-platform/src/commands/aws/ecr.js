// @ts-check
'use strict';

import { exec } from '@actions/exec';

import { getGlobalConfig } from '../../config.js';
import TF from '../tf.js';

class ECR {
  constructor(opts) {
    const globalConfig = getGlobalConfig();
    this.debug = opts?.debug || globalConfig.runtime.debug || false;
    this.projectName = opts?.projectName || globalConfig.project.name;
    this.environmentName =
      opts?.environmentName || globalConfig.environment.name;
    this.moduleType = opts?.moduleType || globalConfig.module.type;
    this.moduleName = opts?.moduleName || globalConfig.module.name;
    this.awsContext = opts.awsContext;
    this.awsCredentials = opts.awsCredentials;
    this.tfStack = 'ecr';

    console.debug('[ECR] awsContext:', this.awsContext);
    console.debug('[ECR] awsCredentials:', this.awsCredentials);

    const {
      runtime: { executionRoot },
    } = globalConfig;
    this.tf = new TF({
      workdir: `${executionRoot}/../src/tf/${this.tfStack}`,
      awsContext: { ...this.awsContext },
    });
  }

  async createRepository() {
    console.log(`Creating ECR Repository`);
    const { projectName, environmentName, moduleType, moduleName, tfStack } =
      this;

    await this.tf.init(projectName, moduleType, moduleName);
    await this.tf.workspace(
      projectName,
      environmentName,
      moduleType,
      moduleName,
      tfStack,
    );
    const planfileName = await this.tf.plan(
      projectName,
      environmentName,
      moduleType,
      moduleName,
      { module_name: moduleName },
    );
    if (planfileName) {
      console.log('Changes detected, applying changes...');
      await this.tf.apply(planfileName);
    } else {
      console.log('No changes detected, skipping apply.');
      return;
    }

    console.log(`Finished Creating ECR Repository`);
  }

  async getRepositoryProperties() {
    console.log(`Getting ECR Repository Properties...`);
    const { projectName, moduleName, moduleType, environmentName } = this;

    await this.tf.init(projectName, moduleType, moduleName);
    await this.tf.workspace(
      projectName,
      environmentName,
      moduleType,
      moduleName,
      'ecr',
    );

    const props = await this.tf.output();
    this.debug && console.debug('ECR Repository Properties', props);

    return props;
  }

  async getLoginPassword() {
    console.log('Getting ECR Password...');

    const { region } = this.awsContext;
    let output = '';
    let error = '';
    const options = {
      listeners: {
        stdout: data => {
          output += data.toString();
        },
        stderr: data => {
          error += data.toString();
        },
      },
      cwd: this.workdir,
      env: {
        ...process.env,
        ...this.awsCredentials,
      },
    };

    await exec(
      'aws',
      ['ecr', 'get-login-password', '--region', region],
      options,
    );

    return output;
  }
}

export default ECR;
