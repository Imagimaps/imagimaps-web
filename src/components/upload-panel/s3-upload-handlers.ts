import { SetStateAction } from 'react';
import { FileUploadHandlerEvent } from 'primereact/fileupload';

import GetUploadUrl from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]/upload';
import { Community } from '@shared/types/community';
import { Map } from '@shared/types/map';
import { World } from '@shared/types/world';
import { UploadStatus } from '.';

const s3UploadHandler =
  (
    community: Community | undefined,
    world: World | undefined,
    map: Map | undefined,
    fileRef: React.RefObject<any>,
    setUploadStatus: (value: SetStateAction<UploadStatus>) => void,
    setUploadProgress: (value: SetStateAction<number>) => void,
    setUploadKey: (value: SetStateAction<string>) => void,
  ) =>
  async (event: FileUploadHandlerEvent) => {
    console.log('uploadHandler', event);
    const communityId = community?.id;
    const worldId = world?.id;
    const mapId = map?.id;

    console.log('Preparing Upload');
    setUploadStatus(UploadStatus.PREPARING);

    if (!fileRef.current) {
      console.error('FileUpload ref not set');
      return;
    }
    if (!communityId || !worldId || !mapId) {
      console.error('Not enough Map context provided');
      // TODO: Show Error Toast
      return;
    }
    if (!event.files || event.files.length === 0) {
      console.error('No files selected');
      setUploadStatus(UploadStatus.ERROR);
      return;
    }

    const file = event.files[0];
    console.log('Selected File:', file);

    const getUploadUrlPromise = GetUploadUrl(communityId, worldId, mapId, {
      query: { filename: file.name },
      data: undefined,
    });

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('layer', file, file.name);

    xhr.upload.addEventListener('progress', event => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      }
    });

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('File Uploaded');
          fileRef.current?.clear();
          fileRef.current?.setUploadedFiles([file]);
          setUploadStatus(UploadStatus.COMPLETE);
        }
      }
    };

    try {
      const uploadCtx = await getUploadUrlPromise;
      if (!uploadCtx) {
        console.error('Upload URL Generation Failed');
        setUploadStatus(UploadStatus.ERROR);
        return;
      }
      console.log('Upload Context:', uploadCtx);
      setUploadKey(uploadCtx.key);

      xhr.open('PUT', uploadCtx.url, true);
      xhr.send(formData);
      console.log('Uploading File');
      setUploadStatus(UploadStatus.UPLOADING);
    } catch (error) {
      console.error('Upload URL Generation Failed', error);
      setUploadStatus(UploadStatus.ERROR);
    }
  };

export default s3UploadHandler;
