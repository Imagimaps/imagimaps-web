// @ts-check
'use strict';

class ServiceOrchestrator {
  constructor(props) {
    this.executionRoot = props.executionRoot;
    this.workspaceDir = props.workspaceDir;

    this.projectName = props.projectName;
    this.environmentName = props.environmentName;
    this.moduleType = props.moduleType;
    this.moduleName = props.moduleName;
    this.moduleDir = props.moduleDir;
    this.aws = props.aws;

    this.awsCredentialsProvider = props.awsCredentialsProvider;
  }

  async buildService() {
    console.log(`---=== Building Service [name: ${this.moduleName}] ===---`);
  }

  async _ensureEcrExists() {
    console.log(`Ensuring ECR repository for ${this.moduleName} exists...`);

    const tf = new TF({
      workdir: `${this.executionRoot}/../src/tf/${ecr}`,
      awsContext: { ...aws }
    })
  }
}

export default ServiceOrchestrator;
