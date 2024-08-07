import { router } from '../../router';
import imageLoaderInstance from '../../../utils/imageLoader';

const type = 'image/png';

router.get('/map/tile/:z/:x/:y', async ctx => {
  const { x, y, z } = ctx.params;
  console.log(`Getting tile for zoom ${z}, point x:${x} y:${y}`);

  const numX = Number(x);
  const numY = Number(y);
  const zoom = Number(z);

  const tileBuffer2 = await imageLoaderInstance.getTile(
    'imagimaps_test_map-min.png',
    zoom,
    numX,
    numY,
    {
      local: true,
    },
  );

  ctx.type = type;
  ctx.body = tileBuffer2;
});
