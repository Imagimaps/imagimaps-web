import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'trace';
const dev = process.env.NODE_ENV !== 'production';

const config = {
  level: logLevel,
  transport: dev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      }
    : undefined,
};

const logger = pino(config);

logger.info('[WithLogger Middleware] Loaded');

const WithLogger = async (ctx: any, next: () => Promise<void>) => {
  ctx.log = logger;
  ctx.log.trace(`[WithLogger Hook] Request to ${ctx.url}`);

  await next();
};

export default WithLogger;
