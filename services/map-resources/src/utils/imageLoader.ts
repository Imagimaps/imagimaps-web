import { promises as fs } from 'fs';
import Sharp from 'sharp';
import {
  S3Client,
  GetObjectCommand,
  GetObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ImageCache, TileCache } from '../cache';

class ImageLoader {
  private static instance: ImageLoader;

  public static getInstance(): ImageLoader {
    if (!ImageLoader.instance) {
      ImageLoader.instance = new ImageLoader();
    }
    return ImageLoader.instance;
  }

  private s3Client: S3Client;

  private constructor() {
    this.s3Client = new S3Client({ region: 'ap-southeast-2' });
  }

  public async getTile(
    imgKey: string,
    zoom: number,
    x: number,
    y: number,
    opts?: { tileSize?: number; local?: boolean },
  ): Promise<Buffer> {
    const { tileSize = 256, local = false } = opts || {
      tileSize: 256,
      local: false,
    };

    const mapWorldSize = { width: 1000, height: 1000 };
    const mapTileCount = {
      x: Math.ceil((mapWorldSize.width / tileSize) * Math.pow(2, zoom)),
      y: Math.ceil((mapWorldSize.height / tileSize) * Math.pow(2, zoom)),
    };

    if (x > mapTileCount.x || x < 0 || y > mapTileCount.y || y < 0) {
      console.log('Invalid tile coordinates', x, y, mapTileCount);
      throw new Error('Invalid tile coordinates');
    }

    const cacheKey = `${imgKey}-${zoom}-${x}-${y}`;
    const tileBuf = TileCache.get<Buffer>(cacheKey);
    if (tileBuf) {
      console.log('Tile: Cache hit', cacheKey);
      return tileBuf;
    }

    console.log('Tile: Cache miss', cacheKey);
    const scale = {
      x: ((mapWorldSize.width / tileSize) * Math.pow(2, zoom)) / mapTileCount.x,
      y:
        ((mapWorldSize.height / tileSize) * Math.pow(2, zoom)) / mapTileCount.y,
    };
    const outputImageSize = {
      width: mapTileCount.x * tileSize * scale.x,
      height: mapTileCount.y * tileSize * scale.y,
    };
    const tilingOverflow = {
      width: Math.ceil(mapTileCount.x * tileSize * (1 - scale.x)),
      height: Math.ceil(mapTileCount.y * tileSize * (1 - scale.y)),
    };
    const imgBuf = await this.getImage(imgKey, {
      size: outputImageSize,
      tilingOverflow,
      local,
    });

    const offX = x * tileSize;
    const offY = y * tileSize;
    const tileBuffer = Sharp(imgBuf)
      .extract({ left: offX, top: offY, width: tileSize, height: tileSize })
      .png()
      .toBuffer();

    TileCache.set(cacheKey, tileBuffer);
    return tileBuffer;
  }

  public async getImage(
    imgKey: string,
    opts?: {
      size?: { width: number; height: number };
      tilingOverflow?: { width: number; height: number };
      local?: boolean;
    },
  ) {
    const {
      size = { width: 256, height: 256 },
      tilingOverflow = { width: 0, height: 0 },
      local = false,
    } = opts || {
      local: false,
      size: { width: 256, height: 256 },
      tilingOverflow: { width: 0, height: 0 },
    };

    const key = `${imgKey}-w${size.width}-h${size.height}`;
    let imgBuf = ImageCache.get<Buffer>(key);
    if (!imgBuf) {
      console.log('Img: Cache miss', key);
      if (local) {
        imgBuf = await fs.readFile(
          './resources/images/imagimaps_test_map-min.png',
        );
      } else {
        const getObjectInput: GetObjectCommandInput = {
          Bucket: 'content.imagimaps.com',
          Key: 'imagimaps_test_map-min.png',
        };
        const dataPackage = await this.s3Client.send(
          new GetObjectCommand(getObjectInput),
        );
        if (!dataPackage.Body) {
          throw new Error('No Object in S3');
        }
        const imgData = await dataPackage.Body.transformToByteArray();
        const imgBuf = Buffer.from(imgData);
        if (!imgBuf) {
          throw new Error('No data in Object from S3');
        }
      }
      if (!imgBuf) {
        throw new Error('No image data');
      }
      imgBuf = await Sharp(imgBuf)
        .resize(size.width, size.height)
        .extend({
          top: 0,
          bottom: tilingOverflow.height,
          left: 0,
          right: tilingOverflow.width,
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toBuffer();
      ImageCache.set(key, imgBuf);
    } else {
      console.log('Img: Cache hit', key);
    }
    return imgBuf;
  }
}

const imageLoaderInstance = ImageLoader.getInstance();
export default imageLoaderInstance;
