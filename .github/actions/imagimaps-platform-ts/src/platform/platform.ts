import * as core from '@actions/core';

import ConfigFilesLoader from './configurator/configFilesLoader';
import Module, { ModuleType, testServiceModule } from './models/module';
import TF from '../wrappers/tf';
import PlatformActionable from './modules/platformActionable';
import Service from './modules/service';
import AwsCredentials from '../aws/awsCredentials';

const SERVICE_BUILD_TF_PREREQS = ['ecr'];
const SERVICE_DEPLOY_TF_PREREQS = [...SERVICE_BUILD_TF_PREREQS, 'ecs-fargate'];

class Platform {
  private configFilesLoader: ConfigFilesLoader;

  private tfClients: Map<string, TF> = new Map();
  private action: string;
  private awsCredentials: AwsCredentials;

  constructor() {
    core.info('Setting up the Imagimaps Platform...');
    this.configFilesLoader = new ConfigFilesLoader();
    this.action = core.getInput('action');
    this.awsCredentials = new AwsCredentials();

    core.debug(`Action: ${this.action}`);
    core.info('Imagimaps Platform setup complete.');
  }
  
  async loadConfig() {
    core.info('Loading platform configuration...');
    const platformConfig = await this.configFilesLoader.loadPlatformConfig();
    const configFiles = await this.configFilesLoader.scanRepository();
    core.info('Platform configuration loaded.');
  }
  
  async checkPreRequisiteInfrastructure(module: Module) {
    core.info(`Checking infrastructure prerequisites for ${module.name}...`)
    let moduleExecutor: PlatformActionable;
    if (module.type === ModuleType.Service) {
      moduleExecutor = new Service(module, this.awsCredentials);
    } else if (module.type === ModuleType.WebApp) {
      core.setFailed('WebApp module type not supported yet.');
      return Promise.reject('WebApp module type not supported yet.');
    } else {
      core.setFailed('Invalid module type.');
      return Promise.reject('Invalid module type.');
    }

    const missingTfDeps = moduleExecutor.checkDependentInfrastructure();
  }
}

export default Platform;
