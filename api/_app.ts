import { hook } from '@modern-js/runtime/server';

import withSession from './_middlewares/withSession';

export default hook(({ addMiddleware }) => {
  addMiddleware(async (ctx, next) => {
    console.log(`access url: ${ctx.url}`);
    await next();
    ctx.res.setHeader('X-Hook', 'Success');
  });
  addMiddleware(withSession);
});
