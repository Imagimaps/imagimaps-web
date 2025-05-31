import pino, { TransportTargetOptions } from 'pino';
import 'pino-loki';
import NodeCache from 'node-cache';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const client = new SSMClient({ region: 'ap-southeast-2' });

const DEFAULT_LOG_LEVEL = 'debug';
const logLevel = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const autoLogging = process.env.AUTO_LOGGING === 'true';
const isLocal = !process.env.DEPLOYED_ENV;
const deployedEnvironment = process.env.DEPLOYED_ENV || 'local';
const remoteLoggingEnabled = process.env.REMOTE_LOGGING_ENABLED === 'true';
const remoteLoggingEndpoint =
  process.env.LOGGING_ENDPOINT || 'http://localhost:3100';

const transportTargets: TransportTargetOptions[] = [];

if (isLocal) {
  transportTargets.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  });
}

if (remoteLoggingEnabled) {
  transportTargets.push({
    target: 'pino-loki',
    level: process.env.LOG_LEVEL || 'info',
    options: {
      batching: true,
      interval: 5, // Send logs every 5 seconds
      labels: {
        app: 'imagimaps',
        environment: deployedEnvironment,
        service: 'webapp-bff',
      },
      host: remoteLoggingEndpoint,
      replaceTimestamp: false,
      silenceErrors: false, // Log transport errors
      timeout: 5000, // 5 seconds timeout for HTTP requests
      // Add authentication if needed
      ...(process.env.LOGGING_USERNAME && process.env.LOGGING_PASSWORD
        ? {
            basicAuth: {
              username: process.env.LOGGING_USERNAME,
              password: process.env.LOGGING_PASSWORD,
            },
          }
        : {}),
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
  message: `Using Logging Config`,
  middleware: 'WithLogger',
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
      logger.debug({
        msg: 'Logging Config Response',
        params: response.Parameter,
      });

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
