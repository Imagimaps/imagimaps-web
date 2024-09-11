const withSession = async (ctx: any, next: () => Promise<void>) => {
  const { cookies, url } = ctx;
  const sessionId = cookies.get('session-token');

  const publicPaths = ['/api/bff/auth', '/api/bff/health'];
  const isPublicPath = publicPaths.some(path => url.startsWith(path));

  if (isPublicPath) {
    console.log('Public path', url);
    await next();
  } else {
    if (!sessionId) {
      console.error('withSession: Session Id not supplied');
      ctx.throw(401, 'Unauthorized');
    }

    if (Array.isArray(sessionId)) {
      console.error(
        `Somehow ended up with multiple session tokens [${sessionId}]`,
      );
      ctx.throw(403, 'Forbidden');
    }

    console.log('Request with session token', sessionId);
    ctx.state.sessionId = sessionId;

    await next();
  }
};

export default withSession;
