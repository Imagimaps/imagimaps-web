import { useEffect, useRef, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Link, useNavigate, useParams } from '@modern-js/runtime/router';
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';

import GetUploadUrl from '@api/bff/map/[community_id]/[world_id]/[map_id]/upload';
import { CommunityModel } from '@/state/communityModel';

import './page.scss';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [{ activeWorld, activeMap, community }] = useModel(CommunityModel);
  const { communityId, worldId, mapId } = useParams();

  const fileRef = useRef<FileUpload>(null);
  const [uploadTilePanelVisible, setUploadTilePanelVisible] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!activeWorld || !activeMap || !community) {
      console.log('No active world, map, or community', activeWorld, activeMap);
      if (!communityId || !worldId || !mapId) {
        console.log('Missing community, world, or map ID');
        navigate('/communities');
        // TODO: Cascading redirects based on what's missing
      }
      // TODO: Actions to hydrate community, world and map data from ID's
    }
  }, []);

  useEffect(() => {
    console.log(`Upload Progress: ${uploadProgress}%`);
  }, [uploadProgress]);

  const uploadHandler = async (event: FileUploadHandlerEvent) => {
    console.log('uploadHandler', event);
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
      return;
    }

    const file = event.files[0];

    const getUploadUrlPromise = GetUploadUrl(communityId, worldId, mapId);

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
        }
      }
    };

    const url = await getUploadUrlPromise;
    if (!url) {
      console.error('Upload URL Generation Failed');
      return;
    }
    console.log('Upload URL:', url);

    xhr.open('PUT', url, true);
    xhr.send(formData);
  };

  console.log('Active Map:', activeMap);
  // TODO: Tree Split View for Managing Layers

  return (
    <>
      <Panel className="map-details-panel" header={`Map: ${activeMap?.name}`}>
        <p>Id: {activeMap?.id}</p>
        <p>Owner: {activeMap?.owner}</p>
        <p>{activeMap?.description}</p>
      </Panel>
      <h1>Map Page</h1>
      {activeMap && <h2>{activeMap.name}</h2>}
      <p>{activeMap?.description}</p>
      <Link to="workspace">Jump into Map Workspace</Link>
      <button onClick={() => setUploadTilePanelVisible(true)}>+</button>
      <Dialog
        header="Upload Layer"
        visible={uploadTilePanelVisible}
        onHide={() => {
          if (!uploadTilePanelVisible) {
            return;
          }
          setUploadTilePanelVisible(false);
        }}
      >
        <div>
          <div className="card">
            <ProgressBar
              value={uploadProgress}
              displayValueTemplate={() => `${uploadProgress} / 1 MB`}
              style={{ width: '300px', height: '20px', marginLeft: 'auto' }}
            />
            <FileUpload
              ref={fileRef}
              customUpload
              uploadHandler={uploadHandler}
              multiple={false}
              accept="image/*"
              maxFileSize={100000000}
              previewWidth={50}
              emptyTemplate={
                <p className="m-0">Drag and drop files to here to upload.</p>
              }
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default MapPage;
