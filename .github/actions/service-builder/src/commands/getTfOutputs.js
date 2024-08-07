'use strict';

import { exec } from '@actions/exec';

/**
 * Retrieves Terraform outputs as JSON.
 * @param {Partial<Object>{ runtime: { tfEngine: string }}} contexts - The contexts object.
 * @param {string} tfWorkDir - The Terraform working directory. Default is '.'.
 * @returns {Promise<Object>} A Promise that resolves to the parsed JSON outputs.
 */
const getTfOutputs = async (contexts, tfWorkDir = '.') => {
  const {
    runtime: { tfEngine },
  } = contexts;

  let output = '';
  let error = '';
  const options = {};
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      error += data.toString();
    }
  };
  options.cwd = tfWorkDir;

  const execStatus = await exec(tfEngine, ['output', '-json'], options);

  if (execStatus !== 0) {
    return Promise.reject(new Error(`Error getting Terraform outputs: ${error}`));
  }
  return Promise.resolve(JSON.parse(output));
};

export { getTfOutputs };
