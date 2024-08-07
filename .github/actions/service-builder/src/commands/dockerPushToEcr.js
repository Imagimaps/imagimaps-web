'use strict';

import core from '@actions/core';
import { exec } from '@actions/exec';

/**
 * Pushes locally built images to target ECR repository.
 *
 * @param {Array<string>} tags - The tags for the Docker container.
 * @param {Object} ecrParams - Parameters of the target ECR repository
 * @param {Object} contexts - The runtime contexts.
 */
async function dockerPushToECR(tags, ecrParams, contexts) {
  const ecrUrl = ecrParams.repository_url.value;
  console.log('Locally built images');
  await exec('docker', ['image', 'ls']);

  console.log('Pushing container(s) to ECR at:', ecrUrl);
  await exec('docker', ['push', ecrUrl]);

  const tagRows = tags.map((tag) => [tag, `${ecrUrl}:${tag}`]);

  await core.summary
    .addHeading('Container Image pushed to ECR')
    .addTable([
      [
        { data: 'Tag', header: true },
        { data: 'URL', header: true },
      ],
      ...tagRows,
    ])
    .write();
}

export { dockerPushToECR };
