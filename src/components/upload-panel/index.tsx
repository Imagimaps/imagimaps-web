import { FC, useEffect, useRef, useState } from 'react';
import { FileUpload, ItemTemplateOptions } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { useModel } from '@modern-js/runtime/model';
import { MeterGroup } from 'primereact/metergroup';
import { PrimeIcons } from 'primereact/api';

import s3UploadHandler from './s3-upload-handlers';
import { AppModel } from '@/state/appModel';
import { LayerModel } from '@/routes/world/[worldId]/[mapId]/_state/layers';

import './index.scss';

const MAX_FILE_SIZE_BYTES = 100000000;
export enum UploadStatus {
  IDLE = 'IDLE',
  PREPARING = 'PREPARING',
  UPLOADING = 'UPLOADING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

type UploadsPanelProps = {
  enableUserUpload?: boolean;
  triggerUpload?: boolean;
  onUploadStarted?: () => void;
  onUploadComplete?: (uploadKey: string) => void;
  onUploadError?: () => void;
};

const UploadsPanel: FC<UploadsPanelProps> = ({
  enableUserUpload,
  triggerUpload,
  onUploadStarted,
  onUploadComplete,
  onUploadError,
}) => {
  const fileRef = useRef<FileUpload>(null);
  const toastRef = useRef<Toast>(null);
  const [{ activeWorld, activeMap, community }] = useModel(AppModel);
  const [{ imageUploads, activeLayer }, layerActions] = useModel(LayerModel);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.IDLE,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadKey, setUploadKey] = useState('');
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    if (triggerUpload) {
      console.log('Triggering Upload');
      fileRef.current?.upload();
    }
  }, [triggerUpload]);

  useEffect(() => {
    console.log(`Upload Progress: ${uploadProgress}%`);
  }, [uploadProgress]);

  useEffect(() => {
    console.log('Upload Status:', uploadStatus);
    if (uploadStatus === UploadStatus.UPLOADING) {
      console.log('Upload Started');
      onUploadStarted?.();
    }
    if (uploadStatus === UploadStatus.COMPLETE) {
      console.log('Upload Complete');
      toastRef.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Upload Complete',
        life: 3000,
      });
      setUploadStatus(UploadStatus.IDLE);
      onUploadComplete?.(uploadKey);
    }
    if (uploadStatus === UploadStatus.ERROR) {
      console.error('Upload Failed');
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Upload Failed',
        life: 3000,
      });
      setUploadStatus(UploadStatus.IDLE);
      onUploadError?.();
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (activeLayer) {
      const upload = imageUploads.get(activeLayer.id);
      if (upload) {
        setUploadKey(upload.key);
        setTotalSize(upload.totalSize);
        setUploadStatus(upload.uploadStatus);
        setUploadProgress(upload.uploadProgress);
        fileRef.current?.setFiles(upload.selectedFiles);
        fileRef.current?.setUploadedFiles(upload.uploadedFiles);
      } else {
        setUploadKey('');
        setTotalSize(0);
        setUploadStatus(UploadStatus.IDLE);
        setUploadProgress(0);
        fileRef.current?.clear();
      }
    }
  }, [activeLayer]);

  useEffect(() => {
    layerActions.setImageUploadState({
      key: uploadKey,
      selectedFiles: fileRef.current?.getFiles() || [],
      uploadedFiles: fileRef.current?.getUploadedFiles() || [],
      uploadStatus,
      uploadProgress,
      totalSize,
    });
  }, [fileRef, uploadKey, uploadProgress, totalSize]);

  const chooseOptions = {
    icon: PrimeIcons.IMAGES,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const uploadOptions = {
    icon: PrimeIcons.CLOUD_UPLOAD,
    className:
      'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
    style: enableUserUpload ? undefined : { display: 'none' },
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
          // eslint-disable-next-line react/prop-types
          value={props.formatSize}
          severity="warning"
          className="upload-item-size"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          // eslint-disable-next-line react/prop-types
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
        uploadHandler={s3UploadHandler(
          community,
          activeWorld,
          activeMap,
          fileRef,
          setUploadStatus,
          setUploadProgress,
          setUploadKey,
        )}
      />
    </Panel>
  );
};

export default UploadsPanel;
