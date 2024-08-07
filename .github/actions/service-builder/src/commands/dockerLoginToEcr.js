'use strict';

import { exec } from '@actions/exec';

async function dockerLoginToECR(ecrParams, contexts) {
  const {
    aws: { region },
  } = contexts;
  const { value: registryId } = ecrParams.registry_id;

  const command = `aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${registryId}.dkr.ecr.${region}.amazonaws.com`;
  await exec(`/bin/bash -c "${command}"`);
}

export { dockerLoginToECR };
