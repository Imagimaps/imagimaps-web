/**
 * This module provides functions related to Terraform operations.
 * @module tf
 */

import { init } from './init.js';
import { workspace } from './workspace.js';
import { plan } from './plan.js';

const tf = (tfWorkDir, contexts) => {
  return {
    init: () => init(contexts, tfWorkDir),
    enableWorkspace: workspaceId => workspace(contexts, tfWorkDir, workspaceId),
    plan: inputs => plan(contexts, tfWorkDir, inputs),
    apply: () => {},
    readOutputs: () => {},
  };
};

export { tf };
