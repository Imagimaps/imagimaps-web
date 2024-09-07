import { hook } from '@modern-js/runtime/server';
import { Context, Next } from 'koa';

export default hook(({ addMiddleware }) => {
  addMiddleware(async (ctx: Context, next: Next) => {
    console.log(`access url: ${ctx.url}`);
    await next();
  });
});
