import { v4 as uuid } from 'uuid';

const WithTraceId = async (ctx: any, next: () => Promise<void>) => {
  const logger = ctx.log.child({ middleware: 'WithTraceId' });
  const { url } = ctx;
  let traceId = ctx.request.headers['x-trace-id'];

  if (!traceId) {
    traceId = uuid();
    ctx.request.headers['x-trace-id'] = traceId;
    logger.trace({
      msg: 'No trace ID found in request headers, Setting one.',
      traceId,
    });
  }
  ctx.traceId = traceId;
  if (!url.endsWith('/api/bff/health')) {
    logger.debug({
      msg: 'Trace Start',
      traceId,
      path: ctx.request.path,
      method: ctx.request.method,
    });
  }
  ctx.log = ctx.log.child({ traceId });
  await next();
};

export default WithTraceId;
