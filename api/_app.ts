import { hook } from '@modern-js/runtime/server';

import WithLogger from './_middlewares/withLogger';
import WithSession from './_middlewares/withSession';

export default hook(({ addMiddleware }) => {
  addMiddleware(WithLogger);
  addMiddleware(WithSession);
});
