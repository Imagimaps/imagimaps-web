import { URLSearchParams } from 'url';
import ServicesConfig from '@api/_config/services';
import { UserCredentials } from '@shared/types/auth';
import { MapApiContext } from '@shared/types/map';
import {
  Map,
  MapLayer,
  MapLayerProcessingStatus,
  UserMapMetadata,
} from '@shared/_types';
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

  const getMap = async (
    mapId: string,
    opts?: { loadUserMetadata?: boolean },
  ) => {
    const reqPromises = [];
    const getMapPromise = fetch(
      `${mapServiceBaseUrl}/api/map/${mapId}?eagerLoad=true`,
      {
        method: 'GET',
        headers: commonHeaders,
      },
    );
    reqPromises.push(getMapPromise);

    if (opts?.loadUserMetadata) {
      const userMetadataPromise = fetch(
        `${mapServiceBaseUrl}/api/map/${mapId}/user/${userCredentials.userId}/metadata`,
        {
          method: 'GET',
          headers: commonHeaders,
        },
      );
      reqPromises.push(userMetadataPromise);
    }

    const [getMapRes, userMetadataRes] = await Promise.all(reqPromises);
    const errors = [];
    if (!getMapRes.ok) {
      errors.push(`Failed to get map. Status: ${getMapRes.status}`);
    }
    if (opts?.loadUserMetadata && !userMetadataRes.ok) {
      errors.push(
        `Failed to get user metadata. Status: ${userMetadataRes.status}`,
      );
    }
    if (errors.length) {
      throw new Error(errors.join('\n'));
    }

    const map: Map = await getMapRes.json();
    const userMetadatDto = opts?.loadUserMetadata
      ? await userMetadataRes.json()
      : null;
    const userMetadata: UserMapMetadata = {
      layerId: userMetadatDto?.activeLayerId,
      position: userMetadatDto?.lastPosition,
      zoom: userMetadatDto?.lastZoom,
    };

    return { map, userMetadata };
  };

  const deleteMap = async (mapId: string) => {
    const response = await fetch(`${mapServiceBaseUrl}/api/map/${mapId}`, {
      method: 'DELETE',
      headers: commonHeaders,
    });

    if (!response.ok) {
      console.error('Failed to delete map', response);
      throw new Error('Failed to delete map');
    }
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
    getMap,
    deleteMap,
    getMapLayerUploadUrl,
    processLayerImageUpload,
    getLayer,
    getLayerStatus,
    deleteLayer,
  };
};

export default MapClient;
