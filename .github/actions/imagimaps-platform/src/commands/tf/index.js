// @ts-check
'use strict';

/**
 * This module provides functions related to Terraform operations.
 * @module tf
 */

import { init } from './init.js';
import { workspace } from './workspace.js';
import { plan } from './plan.js';
import { apply } from './apply.js';

const tf = (tfWorkDir) => {
  return {
    init: () => init(tfWorkDir),
    selectWorkspace: workspaceId => workspace(tfWorkDir, workspaceId),
    plan: (planfileName, inputs) => plan(tfWorkDir, planfileName, inputs),
    apply: (planfileName) => apply(tfWorkDir, planfileName),
    readOutputs: () => {},
  };
};

export { tf };
