import Router from '@koa/router';
import { HealthCheckResponse } from './routes.d';

export const router = new Router();

router.get('/health', async ctx => {
  const { info, dependencies, full } = ctx.request.query;

  const response: HealthCheckResponse = {
    status: 'UP',
  };

  if (info || full) {
    console.info('Collecting Runtime Information');
    response.info = {};
  }

  if (dependencies || full) {
    console.info('Checking Health of Dependencies');
    response.dependencies = {};
    // TODO: For each OAuth2 Provider, check if the Token and Auth endpoints are available
    const resp = await fetch('https://discord.com/api/oauth2/authorize', {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Imagimaps App DEV v0.0.1',
      },
    });
    console.log(resp.status);
    if (resp.status < 500) {
      response.dependencies = {
        discord: 'UP',
      };
    }
  }

  ctx.body = response;
});

router.get('/token/validate', async ctx => {
  ctx.body = 'Token Validation Response';
});

router.post('/token/validate', async ctx => {
  const { token } = ctx.request.body as any;
  console.log(`Validating token ${token}`);
  ctx.body = 'Token Validation Response';
});
