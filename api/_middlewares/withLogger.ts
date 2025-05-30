import pino, { TransportTargetOptions } from 'pino';
import NodeCache from 'node-cache';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const client = new SSMClient({ region: 'ap-southeast-2' });

const DEFAULT_LOG_LEVEL = 'debug';
const logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const autoLogging = process.env.AUTO_LOGGING === 'true';
const dev = process.env.NODE_ENV !== 'production';
const remoteLoggingEndpoint =
  process.env.LOGGING_ENDPOINT || 'http://localhost:3100';

const transportTargets: TransportTargetOptions[] = [
  {
    target: 'pino-loki',
    level: process.env.LOG_LEVEL || 'info',
    options: {
      batching: true,
      interval: 5, // Send logs every 5 seconds
      labels: {
        app: 'webapp-bff',
        environment: dev ? 'development' : 'production',
        service: 'webapp-bff',
      },
      host: remoteLoggingEndpoint,
      replaceTimestamp: false,
      silenceErrors: false, // Log transport errors
      timeout: 5000, // 5 seconds timeout for HTTP requests
      // Add authentication if needed
      ...(process.env.LOKI_USERNAME && process.env.LOKI_PASSWORD
        ? {
            basicAuth: {
              username: process.env.LOKI_USERNAME,
              password: process.env.LOKI_PASSWORD,
            },
          }
        : {}),
    },
  },
];
if (dev) {
  transportTargets.unshift({
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  });
}

const config = {
  level: logLevel,
  autoLogging,
  transport: {
    targets: transportTargets,
  },
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
