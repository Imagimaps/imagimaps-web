import { hook } from '@modern-js/runtime/server';

import WithLogger from './_middlewares/withLogger';
import WithSession from './_middlewares/withSession';
import TrackResponseTimes from './_middlewares/trackResponseTimes';
import WithTraceId from './_middlewares/withTraceId';

export default hook(({ addMiddleware }) => {
  addMiddleware(WithLogger);
  addMiddleware(WithTraceId);
  addMiddleware(TrackResponseTimes);
  addMiddleware(WithSession);
});
