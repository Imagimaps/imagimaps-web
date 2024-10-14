import pino from 'pino';
import NodeCache from 'node-cache';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const client = new SSMClient({ region: 'ap-southeast-2' });

const DEFAULT_LOG_LEVEL = 'debug';
const logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const autoLogging = process.env.AUTO_LOGGING === 'true';
const dev = process.env.NODE_ENV !== 'production';

const config = {
  level: logLevel,
  autoLogging,
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

logger.info({
  message: `[WithLogger Middleware] Using Logging Config`,
  config,
});

const WithLogger = async (ctx: any, next: () => Promise<void>) => {
  let cLogLevel = cache.get<string>('logLevel');
  if (!cLogLevel) {
    try {
      const command = new GetParameterCommand({
        Name: '/service/webapp-bff/log_level',
        WithDecryption: false,
      });

      logger.debug('Getting Logging Config from SSM');
      const response = await client.send(command);
      logger.debug('Logging Config Response', response.Parameter);

      cLogLevel = response.Parameter?.Value || DEFAULT_LOG_LEVEL;
      cache.set('logLevel', cLogLevel);
    } catch (error) {
      logger.error({
        message: 'Failed to load Logging Config from SSM, using default',
        error,
      });
    }
  }
  logger.level = cLogLevel || DEFAULT_LOG_LEVEL;
  ctx.log = logger;
  ctx.log.trace(`[WithLogger Hook] Request to ${ctx.url}`);

  await next();
};

export default WithLogger;
