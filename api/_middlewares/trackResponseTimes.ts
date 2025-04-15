const TrackResponseTimes = async (ctx: any, next: () => Promise<void>) => {
  const logger = ctx.log.child({ middleware: 'TrackResponseTimes' });
  const { traceId } = ctx;
  const start = Date.now();
  try {
    await next();

    const end = Date.now();
    const duration = end - start;
    const { method, url } = ctx.request;
    const { status } = ctx.response;
    const responseTime = `${duration}ms`;

    logger.info({
      mgs: 'Request processed',
      traceId,
      method,
      url,
      status,
      responseTime,
    });
  } catch (error) {
    const end = Date.now();
    const duration = end - start;
    const { method, url } = ctx.request;
    const { status } = ctx.response;
    const responseTime = `${duration}ms`;
    logger.error({
      msg: 'Error processing request',
      traceId,
      error,
      method,
      url,
      status,
      responseTime,
    });
    throw error;
  }
};

export default TrackResponseTimes;
