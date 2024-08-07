import { tf } from './tf/index.js';

/**
 * Returns an object containing commands.
 *
 * @typedef {Object} Commands
 * @property {TfCommands} tf - The tf command.
 */

/**
 * Represents a Terraform object with various operations.
 * @typedef {Function} TfCommands
 */

/**
 * Returns an object containing commands.
 *
 * @param {Object} contexts - The contexts object.
 * @returns {Commands} commands - An object containing commands.
 */
const commands = contexts => {
  return {
    tf: (tfWorkDir) => tf(tfWorkDir, contexts),
  };
};

export { commands };
