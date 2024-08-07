'use strict';

import { exec } from '@actions/exec';

/**
 * Builds a Docker container for a service.
 *
 * @param {string} serviceName - The name of the service.
 * @param {Array<string>} tags - The tags for the Docker container.
 * @param {Object} contexts - The runtime contexts.
 */
async function buildDockerContainer(serviceName, tags, ecrParams, contexts) {
  const {
    runtime: { actionHome, workspaceHome },
  } = contexts;
  const ecrUrl = ecrParams.repository_url.value;
  const dockerContext = workspaceHome;
  const dockerfile = `Dockerfile.service`;

  const dockerTags = tags.reduce((acc, tag) => {
    acc.push('-t', `${ecrUrl}:${tag}`);
    return acc;
  }, []);

  console.log(
    'Building Docker container for service:',
    serviceName,
    'tags:',
    tags.join(', '),
  );

  try {
    await exec('docker', [
      'build',
      ...dockerTags,
      '-f',
      dockerfile,
      '--build-arg',
      `service=${serviceName}`,
      dockerContext,
    ]);
    console.log('Docker container built successfully!');
  } catch (error) {
    console.error('Failed to build Docker container:', error);
  }
}

export { buildDockerContainer };
