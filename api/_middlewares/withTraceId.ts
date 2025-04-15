import { v4 as uuid } from 'uuid';

const WithTraceId = async (ctx: any, next: () => Promise<void>) => {
  const logger = ctx.log.child({ middleware: 'WithTraceId' });
  let traceId = ctx.request.headers['x-trace-id'];
  if (!traceId) {
    traceId = uuid();
    ctx.request.headers['x-trace-id'] = traceId;
    logger.warn({
      msg: 'No trace ID found in request headers, Setting one.',
      traceId,
    });
  }
  ctx.traceId = traceId;
  logger.info(`Trace ID: ${traceId}`);
  await next();
};

export default WithTraceId;
