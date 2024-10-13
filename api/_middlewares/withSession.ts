const WithSession = async (ctx: any, next: () => Promise<void>) => {
  const logger = ctx.log.child({ middleware: 'WithSession' });
  const { cookies, url } = ctx as { cookies: any; url: string };
  const sessionId = cookies.get('session-token');

  const publicPaths = ['/api/bff/auth', '/api/bff/health'];
  const isPublicPath = publicPaths.some(path => url.startsWith(path));

  if (url.endsWith('/api/bff/health')) {
    await next();
  } else if (isPublicPath) {
    logger.info('[WithSession Hook] Public path request', url);
    await next();
  } else {
    if (!sessionId) {
      logger.error('[WithSession Hook]: Session Id not supplied');
      ctx.status = 401;
      ctx.body = {
        message: 'Unauthorized',
      };
      return;
    }

    if (Array.isArray(sessionId)) {
      logger.error(
        `[WithSession Hook] Somehow ended up with multiple session tokens [${sessionId}]`,
      );
      ctx.status = 403;
      ctx.body = {
        message: 'Forbidden',
      };
      return;
    }

    logger.info('[WithSession Hook] Request with session token', sessionId);
    ctx.state.sessionId = sessionId;

    await next();
  }
};

export default WithSession;
