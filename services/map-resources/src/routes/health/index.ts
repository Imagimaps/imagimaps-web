import { HealthCheckResponse } from '../routes.d';
import { router } from '../router';

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
  }

  ctx.body = response;
});
