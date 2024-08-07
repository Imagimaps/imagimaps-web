// @ts-check
'use strict';

import { getGlobalConfig } from './config.js';
import Docker from './commands/docker.js';
import TF from './commands/tf.js';
import ECR from './commands/aws/ecr.js';

class Platform {
  constructor(props) {
    // Eventually phase out this global config if possible
    const globalConfig = getGlobalConfig();

    this.executionRoot = props.executionRoot || globalConfig.runtime.executionRoot;
    this.workspaceDir = props.workspaceDir || globalConfig.runtime.workspaceDir;

    this.projectName = props.projectName || globalConfig.project.name;
    this.environmentName = props.environmentName || globalConfig.environment.name;
    this.moduleType = props.moduleType || globalConfig.module.type;
    this.moduleName = props.moduleName || globalConfig.module.name;
    this.moduleDir = props.moduleDir || globalConfig.module.directory;
    this.aws = props.aws || globalConfig.aws;

    this.tf = {
      ecr: new TF({
        workdir: `${this.executionRoot}/../src/tf/ecr`,
        awsContext: { ...this.aws }
      })
    };
    this.ecr = new ECR({
      context: { ...this.aws }
    });
    this.docker = new Docker({
      context: this.workspaceDir,
      workdir: this.workspaceDir
    });
  }

  async buildModule() {
    console.log(`---=== Building Module [type: ${this.moduleType}] ===---`)

    if (this.moduleType === 'service') {
      await this._bootstrapServiceBuild();
      await this._buildService();
    }
  }

  async deployModule() {
    console.log(`---=== Deploying Module [type: ${this.moduleType}] ===---`)

    if (this.moduleType === 'service') {
      await this._bootstrapServiceDeploy();
    }
  }

  async _planTf(tfModule, aws, inputs = [], isSharedResource = false) {
    if (!/^[a-zA-Z0-9\-]+$/.test(tfModule)) {
      throw new Error('Invalid tfModule: tfModule must be alphanumeric and dashes.');
    }

    const { projectName, moduleName, moduleType, environmentName } = this;
    const mName = isSharedResource ? tfModule : moduleName;
    const mType = isSharedResource ? 'shared' : moduleType;

    const tf = new TF({
      workdir: `${this.executionRoot}/../src/tf/${tfModule}`,
      awsContext: { ...aws }
    })

    await tf.init(projectName, mType, mName);
    await tf.workspace(projectName, environmentName, mType, mName, tfModule);
    const planfileName = await tf.plan(projectName, environmentName, mType, mName, inputs);
    return planfileName;
  }

  async _applyTf(tfModule, aws, planfileName) {
    const tf = new TF({
      workdir: `${this.executionRoot}/../src/tf/${tfModule}`,
      awsContext: { ...aws }
    })

    await tf.apply(planfileName);
  }

  async _bootstrapServiceBuild() {
    console.log('---=== Bootstrapping Build infrastructure ===---');
    const { projectName, moduleName, moduleType, environmentName } = this;

    console.log('Bootstrapping ECR')
    const planfileName = this._planTf('ecr', this.aws, [{ module_name: moduleName }]);
    if (planfileName) {
      console.log('Changes detected, applying changes...');
      await this._applyTf('ecr', this.aws, planfileName);
    } else {
      console.log('No changes detected, skipping apply.');
    }
  }

  async _bootstrapServiceDeploy() {
    console.log('---=== Bootstrapping Deploy infrastructure ===---');
    const { projectName, moduleName, moduleType, environmentName } = this;

    console.log('Bootstrapping ECS Fargate')
    const planfileName = await this._planTf('ecs-fargate', this.aws, [], true);
    if (planfileName) {
      console.log('Changes detected, applying changes...');
      await this._applyTf('ecs-fargate', this.aws, planfileName);
    } else {
      console.log('No changes detected, skipping apply.');
    }
  }

  async _buildService() {
    const tfEcr = this.tf.ecr;
    const { projectName, moduleName, moduleType, environmentName } = this;

    await tfEcr.init(projectName, moduleType, moduleName);
    await tfEcr.workspace(projectName, environmentName, moduleType, moduleName, 'ecr');
    const { repository_url } = await tfEcr.output();

    await this.docker.buildService(moduleName);
    await this.docker.tag(moduleName, [`${repository_url}:latest`]);

    const ecrPassword = await this.ecr.getLoginPassword();
    await this.docker.login(repository_url, ecrPassword);
    await this.docker.push(repository_url);
  }
}

export default Platform;
