import { exec } from '@actions/exec';

class Pnpm {
  constructor(opts) {
    this.workdir = opts?.workdir || '.';
  }

  async install() {
    await exec(
      'pnpm',
      ['install', '--ignore-scripts'],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        }
      },
    );
  }

  async build() {
    await exec(
      'pnpm',
      ['build'],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        }
      },
    );
  }

  async containerise() {
    await exec(
      'pnpm',
      ['containerise'],
      {
        cwd: this.workdir,
        env: {
          ...process.env
        }
      },
    );
  }
}

export default Pnpm;
