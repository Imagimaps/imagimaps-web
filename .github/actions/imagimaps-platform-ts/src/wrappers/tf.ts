import { ExecOptions, exec, getExecOutput } from '@actions/exec';
import * as core from '@actions/core';

import CredentialsContext from '../aws/models/credentialsContext';
import Module from '../platform/models/module';

type TfActions = 'init' | 'workspace' | 'plan' | 'apply' | 'output';
type TfFailure = {
  reason: string;
  module: string;
  action: TfActions;
};
type TfOutput = {
  output: Record<string, string>
  module: string;
};

class TF {
  private tfModule: string;
  private tfModuleDir: string;
  private platformModule: Module;
  private awsCredentialsContext: CredentialsContext;
  
  private engine: string;
  private initialised: boolean = false;
  private planfileName: string = '';
  private execOptions: ExecOptions;
  private environment: string;
  
  constructor(tfModule: string, platformModule: Module, awsCredentialsContext: CredentialsContext) {
    this.tfModule = tfModule;
    this.tfModuleDir = `${__dirname}/../tf/${tfModule}`;
    this.platformModule = platformModule;
    this.awsCredentialsContext = awsCredentialsContext;

    const envInput = core.getInput('environment');
    if (!envInput) {
      core.setFailed('No environment specified');
      throw new Error('No environment specified');
    }
    this.environment = envInput;
    
    this.engine = process.env.TF_ENGINE || 'terraform';
    this.execOptions = {
      cwd: this.tfModuleDir,
      env: {
        ...process.env,
        ...awsCredentialsContext.asEnvVars(),
      }
    };

  }

  private processExecStatus(execStatus: number, action: TfActions) {
    const { tfModule } = this;
    if (execStatus !== 0) {
      core.setFailed(`Tf ${action} failed for ${tfModule}, status: ${execStatus}`);
      core.debug(`AWS Account ID: ${this.awsCredentialsContext.accountId}`)
      core.debug(`AWS Credentials: ${JSON.stringify(this.awsCredentialsContext)}`)
      const failure: TfFailure = {
        reason: `Tf ${action} failed for ${tfModule} to account ${this.awsCredentialsContext.accountId}`,
        module: tfModule,
        action,
      }
      return Promise.reject<TfFailure>(failure);
    }
    return Promise.resolve();
  }
  
  async init(backendVars?: string[]) {
    core.info(`Initializing Terraform in ${this.tfModuleDir}`);

    const { accountId, region } = this.awsCredentialsContext;
    const { projectName, type: moduleType, name: moduleName } = this.platformModule;
    
    let tfBackendVars: string;
    if (backendVars) {
      tfBackendVars = backendVars.join(' ');
    } else {
      tfBackendVars = [
        `-backend-config="region=${region}"`,
        `-backend-config="bucket=tf-state-${region}-${accountId}"`,
        `-backend-config="key=${projectName}/${moduleType}/${moduleName}/terraform.tfstate"`,
        `-backend-config="dynamodb_table=tf-state-lock-${region}-${accountId}"`,
      ].join(' ');
    }

    const execStatus = await exec(
      `${this.engine} init ${tfBackendVars}`,
      ['-reconfigure'],
      this.execOptions,
    );

    this.initialised = true;
    return this.processExecStatus(execStatus, 'init');
  }

  async workspace() {
    if (!this.initialised) {
      core.setFailed('Terraform has not been initialised');
    }

    const { projectName: project, type: moduleType, name: moduleName } = this.platformModule;
    const workspaceId = `${project}-${this.environment}-${moduleType}-${moduleName}-${this.tfModule}`;
    core.info(`Selecting Terraform workspace ${workspaceId} at ${this.tfModuleDir}`);
    
    const execStatus = await exec(
      this.engine,
      ['workspace', 'select', '-or-create', workspaceId],
      this.execOptions,
    );

    return this.processExecStatus(execStatus, 'workspace');
  }

  async plan(inputs: Record<string, string> = {}) {
    if (!this.initialised) {
      core.setFailed('Terraform has not been initialised');
    }

    const { projectName: project, type: moduleType, name: moduleName } = this.platformModule;
    const { tfModule, tfModuleDir } = this;

    const awsCredsEnvVars = this.awsCredentialsContext.asEnvVars();
    const planfileName = `${moduleType}_${moduleName}_${tfModule}.plan`;
    
    core.info(`Running Terraform plan at ${tfModuleDir}. Will output to ${planfileName}`);

    const commonInputs = [
      '-var',
      `aws_region=${awsCredsEnvVars.AWS_REGION}`,
      '-var',
      `project=${project}`,
      '-var',
      `environment=${this.environment}`,
    ];
    const optInputs = Object.entries(inputs).map(([key, value]) => ['-var', `${key}=${value}`]).flat();
    const planArgs = [...commonInputs, ...optInputs];

    core.debug(`plan inputs: ${JSON.stringify(planArgs)}`);

    const { stdout, stderr } = await getExecOutput(
      this.engine,
      ['plan', ...planArgs, `-out=${planfileName}`],
      this.execOptions,
    );

    if (stderr) {
      core.setFailed(`Error running Terraform plan: ${stderr}`);
      const failure: TfFailure = {
        reason: `Tf plan failed for ${tfModule} to account ${this.awsCredentialsContext.accountId}`,
        module: tfModule,
        action: 'plan',
      }
      return Promise.reject<TfFailure>(failure);
    }

    if (stdout.includes("Your infrastructure matches the configuration.")) {
      this.planfileName = '';
      return "";
    }
    this.planfileName = planfileName;
    return planfileName;
  }
  
  async apply() {
    if (!this.initialised) {
      core.setFailed('Terraform has not been initialised');
    }
    if (!this.planfileName) {
      core.info('No changes detected. Skipping apply.');
      return;
    }

    const execStatus = await exec(
      this.engine,
      ['apply', this.planfileName],
      this.execOptions,
    );

    this.planfileName = '';
    return this.processExecStatus(execStatus, 'apply');
  }

  async output() {
    const { tfModule } = this;

    const { stdout, stderr } = await getExecOutput(
      this.engine,
      ['output'],
      this.execOptions,
    );

    if (stderr) {
      core.setFailed(`Error running Terraform plan: ${stderr}`);
      const failure: TfFailure = {
        reason: `Tf output failed for ${tfModule} to account ${this.awsCredentialsContext.accountId}`,
        module: tfModule,
        action: 'output',
      }
      return Promise.reject<TfFailure>(failure);
    }

    const lines = stdout.split('\n');
    const outputObject: Record<string, string> = {};
    for (const line of lines) {
      const [key, value] = line.split(' = ');
      if (key && value) {
        outputObject[key.trim()] = value.replace(/"/g, '').trim();
      }
    }

    return {
      output: outputObject,
      module: tfModule,
    } as TfOutput;
  }
}

export default TF;

export {
  TfActions,
  TfFailure,
  TfOutput
}
