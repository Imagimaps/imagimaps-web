import { bootstrapModule } from './bootstrap.js';
import { buildModule } from './build.js';

const executor = (shell) => ({
  build: (command) => async () => {
    await bootstrapModule(shell);
    await buildModule(shell);
    // Upload tf plan
  },

  // Add more curried functions as needed
});

export {
  executor
}

