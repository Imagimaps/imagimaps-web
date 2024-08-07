import { appTools, defineConfig } from '@modern-js/app-tools';
import { bffPlugin } from '@modern-js/plugin-bff';
import { koaPlugin } from '@modern-js/plugin-koa';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true,
  },
  server: {
    port: process.env.NODE_ENV === 'production' ? 80 : 8080,
  },
  plugins: [appTools(), bffPlugin(), koaPlugin()],
});
