import Koa from 'koa';
import parser from 'koa-bodyparser';
import cors from '@koa/cors';
import { oas } from 'koa-oas3';
// import oas3Spec from '@resources/oas3/api.yml';
import { router } from './routes';

const port = process.env.PORT || 8081;
console.log(`process.env.PORT: ${process.env.PORT ?? 'undefined'}`);

/**
 * TODO: Base routes on OAS3 spec (import { oas } from 'koa-oas3';)
 * https://github.com/atlassian/koa-oas3
 * **/

const app = new Koa();
app.use(parser());
app.use(cors());

oas({
  file: `${__dirname}/../resources/oas3/api.yml`,
  endpoint: '/openapi.json',
  uiEndpoint: '/',
})
  .then(oasMw => {
    app.use(oasMw);
    console.log('oas3 schema loaded');

    app.use(router.routes());

    app.use(async ctx => {
      ctx.body = 'Default Response';
    });

    app.listen(port, () => {
      console.log(`server started on port ${port}`);
    });
  })
  .catch(err => console.error(err))
  .finally(() => console.log('Oauth2 service setup complete...'));
