import * as core from '@actions/core';

import Platform from './platform/platform';

const tfRootDir = `${process.env.GITHUB_WORKSPACE}/.github/actions/imagimaps-platform-ts/tf`;

const run = async (): Promise<void> => {
  core.info('Welcome to Imagimaps!')
  core.debug('Debug Mode Enabled');
  core.debug(`__dirname: ${__dirname}`);
  core.debug(`tfRootDir: ${tfRootDir}`);

  const platform = new Platform();
  await platform.loadConfig();
}

run();
