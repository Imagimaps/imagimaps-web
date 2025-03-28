import { URLSearchParams } from 'url';
import ServicesConfig from '@api/_config/services';
import { UserCredentials } from '@shared/types/auth';
import { MapApiContext } from '@shared/types/map';
import { MapLayer, MapLayerProcessingStatus } from '@shared/_types';
import { GetImageUploadUrlResponse } from './mapclient.types';

const { mapServiceBaseUrl } = ServicesConfig();

const MapClient = (userCredentials?: UserCredentials) => {
  if (!userCredentials) {
    console.error('User credentials not provided');
    throw new Error('User credentials not provided');
  }

  const commonHeaders = {
    'x-source': 'bff-service',
    'x-user-id': userCredentials.userId,
    'x-session-id': userCredentials.sessionToken,
    'Content-Type': 'application/json',
  };

  const getMapLayerUploadUrl = async (
    mapCtx: MapApiContext,
    filename: string,
  ) => {
    const { mapId } = mapCtx;
    if (!mapId) {
      console.error('Not enough Map context provided');
      throw new Error('Missing Map Context');
    }

    const getParams = new URLSearchParams([
      ['mapId', mapId],
      ['filename', filename],
    ]).toString();
    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/upload/s3url?${getParams}`,
      {
        method: 'GET',
        headers: commonHeaders,
      },
    );

    if (!response.ok) {
      console.error('Failed to get upload URL', response);
      throw new Error('Failed to get upload URL');
    }

    const responseParsed: GetImageUploadUrlResponse = await response.json();
    return responseParsed;
  };

  const processLayerImageUpload = async (
    mapId: string,
    layerId: string,
    uploadKey: string,
  ) => {
    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/${mapId}/layer/${layerId}/image/process`,
      {
        method: 'POST',
        headers: commonHeaders,
        body: JSON.stringify({ uploadKey }),
      },
    );

    if (!response.ok) {
      console.error('Failed to process layer image upload', response);
      throw new Error('Failed to process layer image upload');
    }
  };

  const getLayer = async (
    mapId: string,
    layerId: string,
  ): Promise<MapLayer> => {
    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/${mapId}/layer/${layerId}`,
      {
        method: 'GET',
        headers: commonHeaders,
      },
    );

    if (!response.ok) {
      console.error('Failed to get layer', response);
      throw new Error('Failed to get layer');
    }

    const responseParsed = await response.json();
    return responseParsed;
  };

  const getLayerStatus = async (
    mapId: string,
    layerId: string,
  ): Promise<{
    status: string;
    processingStatus: MapLayerProcessingStatus;
  }> => {
    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/${mapId}/layer/${layerId}/status`,
      {
        method: 'GET',
        headers: commonHeaders,
      },
    );

    if (!response.ok) {
      console.error('Failed to get layer status', response);
      throw new Error('Failed to get layer status');
    }

    const responseParsed = await response.json();
    return responseParsed;
  };

  const deleteLayer = async (mapId: string, layerId: string) => {
    const response = await fetch(
      `${mapServiceBaseUrl}/api/map/${mapId}/layer/${layerId}`,
      {
        method: 'DELETE',
        headers: commonHeaders,
      },
    );

    if (!response.ok) {
      console.error('Failed to delete layer', response);
      throw new Error('Failed to delete layer');
    }
  };

  return {
    getMapLayerUploadUrl,
    processLayerImageUpload,
    getLayer,
    getLayerStatus,
    deleteLayer,
  };
};

export default MapClient;
