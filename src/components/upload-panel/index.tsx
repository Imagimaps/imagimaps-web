import { useEffect, useRef, useState } from 'react';
import {
  FileUpload,
  FileUploadHandlerEvent,
  ItemTemplateOptions,
} from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { useModel } from '@modern-js/runtime/model';
import { MeterGroup } from 'primereact/metergroup';
import { PrimeIcons } from 'primereact/api';

import GetUploadUrl from '@api/bff/map/[community_id]/[world_id]/[map_id]/upload';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

const MAX_FILE_SIZE_BYTES = 100000000;
enum UploadStatus {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  UPLOADING = 'UPLOADING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

const UploadsPanel = () => {
  const fileRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);
  const [{ activeWorld, activeMap, community }] = useModel(CommunityModel);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.IDLE,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    console.log(`Upload Progress: ${uploadProgress}%`);
  }, [uploadProgress]);

  useEffect(() => {
    console.log('Upload Status:', uploadStatus);
    if (uploadStatus === UploadStatus.ERROR) {
      console.error('Upload Failed');
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Upload Failed',
        life: 3000,
      });
      setUploadStatus(UploadStatus.IDLE);
    }
  }, [uploadStatus]);

  const uploadHandler = async (event: FileUploadHandlerEvent) => {
    console.log('uploadHandler', event);
    const communityId = community?.id;
    const worldId = activeWorld?.id;
    const mapId = activeMap?.id;

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
          setUploadStatus(UploadStatus.COMPLETE);
        }
      }
    };

    try {
      const url = await getUploadUrlPromise;
      if (!url) {
        console.error('Upload URL Generation Failed');
        setUploadStatus(UploadStatus.ERROR);
        return;
      }
      console.log('Upload URL:', url);

      xhr.open('PUT', url, true);
      xhr.send(formData);
      console.log('Uploading File');
      setUploadStatus(UploadStatus.UPLOADING);
    } catch (error) {
      console.error('Upload URL Generation Failed', error);
      setUploadStatus(UploadStatus.ERROR);
    }
  };

  const chooseOptions = {
    icon: PrimeIcons.IMAGES,
    // iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const uploadOptions = {
    icon: PrimeIcons.CLOUD_UPLOAD,
    // iconOnly: true,
    className:
      'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };
  const cancelOptions = {
    icon: PrimeIcons.TIMES,
    iconOnly: true,
    className:
      'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };

  const onTemplateSelect = (e: any) => {
    let _totalSize = totalSize;
    const { files } = e;

    Object.keys(files).forEach(key => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: any) => {
    let _totalSize = 0;

    e.files.forEach((file: any) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    console.log('File Uploaded', e.files);
  };

  const onTemplateRemove = (file: any, callback: any) => {
    console.log('onTemplateRemove', file);
    setTotalSize(totalSize - file.size);
    callback();
  };

  const headerTemplate = (options: any) => {
    const { chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    console.log('Value:', totalSize, value);
    const formatedValue = fileRef?.current
      ? fileRef.current.formatSize(totalSize)
      : '0 B';

    const meterGroupStartTemplate = () => {
      return (
        <div className="file-size-meter-marker">
          <span className="limit-display">{formatedValue} / 100 MB</span>
        </div>
      );
    };

    return (
      <div
        className="upload-controls-container"
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="upload-controls">
          {chooseButton}
          {uploadButton}
          {cancelButton}
        </div>
        <div className="status-bars">
          {uploadStatus === UploadStatus.IDLE && (
            <MeterGroup
              className="file-size-limit-meter-group"
              labelPosition={undefined}
              start={meterGroupStartTemplate}
              values={[
                {
                  label: 'Upload Limit Consumed',
                  value: (totalSize / MAX_FILE_SIZE_BYTES) * 100,
                },
              ]}
            />
          )}
          {(uploadStatus === UploadStatus.PREPARING ||
            uploadStatus === UploadStatus.UPLOADING) && (
            <>
              {/* <p>{`${formatedValue} / 100 MB`}</p> */}
              <ProgressBar
                className="upload-progress-bar"
                value={uploadProgress}
                displayValueTemplate={() => `${uploadProgress} / 100 MB`}
                showValue={true}
                mode={
                  uploadStatus === UploadStatus.PREPARING
                    ? 'indeterminate'
                    : 'determinate'
                }
              />
            </>
          )}
        </div>
      </div>
    );
  };

  const itemTemplate = (file: any, props: ItemTemplateOptions) => {
    return (
      <div className="upload-item-wrapper">
        <div className="upload-item-preview">
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="upload-item-details">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="upload-item-size"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="file-drop">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        ></i>
        <span
          style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  return (
    <Panel className="uploads-panel">
      <Toast ref={toastRef} />
      <FileUpload
        className="file-upload"
        ref={fileRef}
        mode="advanced"
        customUpload
        multiple={false}
        accept="*"
        maxFileSize={MAX_FILE_SIZE_BYTES}
        previewWidth={50}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        itemTemplate={itemTemplate}
        headerTemplate={headerTemplate}
        emptyTemplate={emptyTemplate}
        onSelect={onTemplateSelect}
        onUpload={onTemplateUpload}
        onClear={() => {
          setTotalSize(0);
        }}
        onBeforeDrop={e => {
          console.log('onBeforeDrop', e);
          return true;
        }}
        onValidationFail={e => {
          console.log('onValidationFail', e);
        }}
        onError={e => {
          console.log('onError', e);
        }}
        uploadHandler={uploadHandler}
      />
    </Panel>
  );
};

export default UploadsPanel;
