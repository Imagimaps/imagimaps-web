'use strict';

import { exec } from '@actions/exec';

import { getGlobalConfig } from '../../config.js';
import TF from '../tf.js';

class ECS {
  constructor(clusterType, opts) {
    const globalConfig = getGlobalConfig();
    this.debug = opts?.debug || globalConfig.runtime.debug || false;
    this.projectName = opts?.projectName || globalConfig.project.name;
    this.environmentName =
      opts?.environmentName || globalConfig.environment.name;
    this.envShortName =
      opts?.envShortName || globalConfig.environment.shortname;
    this.moduleType = opts?.moduleType || globalConfig.module.type;
    this.moduleName = opts?.moduleName || globalConfig.module.name;
    this.awsContext = opts.awsContext;
    this.awsCredentials = opts.awsCredentials;

    if (clusterType === 'fargate') {
      this.tfStack = 'ecs-fargate';
    } else {
      throw new Error(
        'Invalid cluster type. Currently only Fargate is supported',
      );
    }

    const {
      runtime: { executionRoot },
    } = globalConfig;
    this.tf = new TF({
      workdir: `${executionRoot}/../src/tf/${this.tfStack}`,
      awsContext: { ...this.awsContext },
    });
  }

  async createCluster() {
    console.log(`Creating ECS Cluster`);

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
    );
    if (planfileName) {
      console.log('Changes detected, applying changes...');
      await this.tf.apply(planfileName);
    } else {
      console.log('No changes detected, skipping apply.');
      return;
    }
  }

  async deployService() {
    console.log('Deploying ECS Service');
    const {
      runtime: { executionRoot },
    } = getGlobalConfig();

    const { projectName, environmentName, moduleType, moduleName } = this;
    const tfStack = 'ecs-service';

    const tf = new TF({
      workdir: `${executionRoot}/../src/tf/${tfStack}`,
      awsContext: { ...this.awsContext },
    });

    await tf.init(projectName, moduleType, moduleName);
    await tf.workspace(
      projectName,
      environmentName,
      moduleType,
      moduleName,
      tfStack,
    );
    const planfileName = await tf.plan(
      projectName,
      environmentName,
      moduleType,
      moduleName,
      {
        environment_short_name: this.envShortName,
        service_name: moduleName,
        desired_count: 1,
      },
    );
    if (planfileName) {
      console.log('Changes detected, applying changes...');
      await tf.apply(planfileName);
    } else {
      console.log('No changes detected, skipping apply.');
      return;
    }
  }
}

export default ECS;
