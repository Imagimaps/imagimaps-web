import { exec } from '@actions/exec';

class Docker {
  constructor(opts) {
    this.context = opts?.context || '.';
    this.workdir = opts?.workdir || '.';
  }

  async buildService(serviceName) {
    console.log(`Building Docker image for ${serviceName}`);
    await exec(
      'docker',
      ['build', '--build-arg', `service=${serviceName}`, '-t', `${serviceName}:latest`, '-f', 'Dockerfile.service', this.context],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        }
      },
    );
  }

  async buildBff(webAppName) {
    console.log(`Building Bff Docker image for ${webAppName}`);
    console.warn('Bff Docker image build is not yet implemented.')
  }

  async buildWebApp(webAppName) {
    console.log(`Building WebApp Docker image for ${webAppName}`);
    console.warn('WebApp Docker image build is not yet implemented.')
  }

  async tag(serviceName, tags) {
    console.log('Tagging Docker image');
    await exec(
      'docker',
      ['tag', `${serviceName}:latest`, ...tags],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        }
      },
    );
  }

  async login(repositoryUrl, password) {
    console.log('Logging into Container registry');
    if (!password) {
      throw new Error('Password is required to login to the container registry');
    }

    await exec(
      'docker',
      ['login', '--username', 'AWS', '--password-stdin', repositoryUrl],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        },
        input: Buffer.from(password)
      },
    );
  }

  async push(repositoryUrl) {
    console.log('Pushing Container to repository');
    await exec(
      'docker',
      ['push', repositoryUrl],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        }
      },
    );
  }
}

export default Docker;
