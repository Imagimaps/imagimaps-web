// @ts-check
'use strict';

import AwsCredentials from './awsCredentials.js';
import ECR from './commands/aws/ecr.js';
import ECS from './commands/aws/ecs.js';
import Docker from './commands/docker.js';

class Orchestrator {
  constructor(opts) {
    this.runtime = opts?.runtime;
    this.module = opts?.module;
    this.awsCredentialsProvider =
      opts.awsCredentialProvider || new AwsCredentials();

    this.actions = [];
  }

  configureFor(module) {
    this.module = module;
    return this;
  }

  build() {
    this.actions.push('BUILD');
    return this;
  }

  deploy() {
    this.actions.push('DEPLOY');
    return this;
  }

  async run() {
    console.log(`---=== Running Platform Orchestrator ===---`);

    const awsCreds = this.awsCredentialsProvider;

    if (this.module.type == 'service' && this.actions.includes('BUILD')) {
      const artifactsAwsAccountId = process.env.ARTIFACTS_AWS_ACCOUNT_ID;
      const awsArtifactsAccContext = await awsCreds.authWithWebIdentity(
        artifactsAwsAccountId,
        { debug: this.runtime.debug },
      );
      const ecrAwsCredentials = awsCreds.getCredentialsAsEnvVars(
        artifactsAwsAccountId,
      );
      console.debug('ECR Context:', awsArtifactsAccContext);
      console.debug('ECR AWS Credentials:', ecrAwsCredentials);

      const ecr = new ECR({
        awsContext: { ...awsArtifactsAccContext },
        awsCredentials: ecrAwsCredentials,
      });
      await ecr.createRepository();
      const { repository_url } = await ecr.getRepositoryProperties();

      const docker = new Docker({
        context: this.runtime.workspaceDir,
        workdir: this.runtime.workspaceDir,
      });

      await docker.buildService(this.module.name);
      await docker.tag(this.module.name, [`${repository_url}:latest`]);

      const ecrPassword = await ecr.getLoginPassword();
      await docker.login(repository_url, ecrPassword);
      await docker.push(repository_url);
    }

    if (this.module.type == 'service' && this.actions.includes('DEPLOY')) {
      const devAwsAccountId = process.env.AWS_ACCOUNT_ID;
      const awsDevAccContext = await awsCreds.authWithWebIdentity(
        devAwsAccountId,
        { debug: this.runtime.debug },
      );
      const devAwsCredentials =
        awsCreds.getCredentialsAsEnvVars(devAwsAccountId);

      const fargate = new ECS('fargate', {
        awsContext: { ...awsDevAccContext },
        awsCredentials: devAwsCredentials,
      });

      await fargate.createCluster();
      await fargate.deployService();
    }
  }
}

export default Orchestrator;
