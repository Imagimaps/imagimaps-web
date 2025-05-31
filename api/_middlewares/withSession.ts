const WithSession = async (ctx: any, next: () => Promise<void>) => {
  const logger = ctx.log.child({ middleware: 'WithSession' });
  const { cookies, url } = ctx as { cookies: any; url: string };
  const sessionId = cookies.get('session-token');
  const userId = cookies.get('id-token');

  const publicPaths = ['/api/bff/auth', '/api/bff/health'];
  const isPublicPath = publicPaths.some(path => url.startsWith(path));

  if (url.endsWith('/api/bff/health')) {
    await next();
  } else if (isPublicPath) {
    logger.info({ msg: 'Public path request', url });
    await next();
  } else {
    if (!sessionId) {
      logger.error('Session Id not supplied');
      ctx.status = 401;
      ctx.body = {
        message: 'Unauthorized',
      };
      return;
    }

    if (Array.isArray(sessionId)) {
      logger.error({ msg: `Multiple session tokens found`, sessionId });
      ctx.status = 403;
      ctx.body = {
        message: 'Forbidden',
      };
      return;
    }

    logger.info({ msg: 'Request with session token', sessionId });
    ctx.state.sessionId = sessionId;
    ctx.state.userId = userId;

    ctx.log = ctx.log.child({
      sessionId,
      userId,
    });

    await next();
  }
};

export default WithSession;
