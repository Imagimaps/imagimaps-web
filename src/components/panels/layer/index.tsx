import { Panel } from 'primereact/panel';
import { FC, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useModel } from '@modern-js/runtime/model';
import { LayerStatus, MapLayerProcessingStatus } from '@shared/_types';
import GetLayer, {
  DELETE as DeleteLayer,
} from '@api/bff/user/map/[mapId]/layer/[layerId]';
import { post as UpdateLayer } from '@api/bff/user/map/[mapId]/layer';
import { post as ProcessImage } from '@api/bff/images/process';
import GetLayerProcessingStatus from '@api/bff/user/map/[mapId]/layer/[layerId]/status';
import EditableTitleRow from '@/components/editable-rows/title';
import EditableTextAreaRow from '@/components/editable-rows/text-area';
import UploadsPanel from '@/components/upload-panel';
import { LayerModel } from '@/routes/world/[worldId]/[mapId]/_state/layers';
import { AppModel } from '@/state/appModel';
import { useRemoteBackends } from '@/hooks/remoteBackends';

import './index.scss';

const LayerPanel: FC = () => {
  const { cdnBaseUrl } = useRemoteBackends();
  const [triggerUpload, setTriggerUpload] = useState(false);
  const [processingStatus, setProcessingStatus] =
    useState<MapLayerProcessingStatus>();

  const [
    {
      activeLayer,
      layers,
      editState,
      fieldHasChanged,
      currentLayerHasChanges,
      activeLayerIsProcessing,
    },
    layerActions,
  ] = useModel(LayerModel);
  const [{ activeMap }, appActions] = useModel(AppModel);
  const layerId = activeLayer?.id;
  const editModel = layers.find(l => l.id === layerId);
  const fieldEditState = editState.get(layerId ?? '');

  useEffect(() => {
    if (!activeMap || !activeLayer) {
      return undefined;
    }
    if (activeLayerIsProcessing) {
      const intervalHandle = setInterval(() => {
        GetLayerProcessingStatus(activeMap.id, activeLayer.id).then(res => {
          setProcessingStatus(res.processingStatus);
          if (res.processingStatus.stage === 'COMPLETE') {
            clearInterval(intervalHandle);
            console.log('[Layer Panel] Processing Complete');
            layerActions.setLayerProcessed(activeLayer.id);
            GetLayer(activeMap.id, activeLayer.id).then(layer => {
              console.log('[Layer Panel] Updated Layer:', layer);
              appActions.addLayer(layer);
              layerActions.saveUpdatedLayer(layer);
            });
          }
          if (res.processingStatus.stage === 'FAILED') {
            clearInterval(intervalHandle);
            console.error('[Layer Panel] Processing Failed');
            layerActions.setLayerProcessed(activeLayer.id);
          }
        });
      }, 2000);

      return () => {
        clearInterval(intervalHandle);
      };
    }

    return undefined;
  }, [activeMap, activeLayer, activeLayerIsProcessing]);

  if (!editModel) {
    return null;
  }

  return (
    <Panel
      className="layer-panel"
      header={
        <>
          <Button
            icon="pi pi-save"
            className="p-button-rounded p-button-text"
            disabled={!currentLayerHasChanges}
            tooltip={
              currentLayerHasChanges ? 'Save Changes' : 'No Changes to save'
            }
            tooltipOptions={{ position: 'top' }}
            onClick={async () => {
              if (!activeMap || !editModel) {
                return;
              }
              console.log('Saving Layer', editModel);
              const updatedLayer = await UpdateLayer(activeMap.id, {
                query: undefined,
                data: { layer: editModel },
              });
              layerActions.saveUpdatedLayer(updatedLayer);
              layerActions.resetFieldEditState();
            }}
          >
            Save
          </Button>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text"
            onClick={async () => {
              console.log('Delete Layer');
              if (!activeMap || !editModel) {
                return;
              }
              await DeleteLayer(activeMap.id, editModel.id);
              layerActions.deleteLayer(editModel.id);
            }}
          >
            Delete{' '}
          </Button>
        </>
      }
    >
      <EditableTitleRow
        value={editModel.name}
        editMode={fieldEditState?.name ?? false}
        valueChanged={fieldHasChanged('name')}
        onEditEnable={() => {
          layerActions.setFieldEditState('name', true);
        }}
        onChange={value => {
          layerActions.updateField('name', value);
        }}
        onUndo={() => {
          layerActions.undoEditsToField('name');
          layerActions.setFieldEditState('name', false);
        }}
      />
      <EditableTextAreaRow
        value={editModel.description ?? ''}
        label="Description"
        editMode={fieldEditState?.description ?? false}
        valueChanged={fieldHasChanged('description')}
        onEditEnable={() => {
          layerActions.setFieldEditState('description', true);
        }}
        onChange={value => {
          layerActions.updateField('description', value);
        }}
        onUndo={() => {
          layerActions.undoEditsToField('description');
          layerActions.setFieldEditState('description', false);
        }}
      />
      <h5>Layer Parameters</h5>
      <p>
        Is Default?{' '}
        {editModel.status === LayerStatus.DRAFT && (
          <span className="metadata">
            Layer needs to be active to be able to set as Default
          </span>
        )}
      </p>
      <p>{`Offset: [X: ${editModel.topography.position.x}, Y: ${editModel.topography.position.y}]`}</p>
      <p>{` Scale: [X: ${editModel.topography.scale.x}, Y: ${editModel.topography.scale.y}]`}</p>
      {editModel.imagePath && !activeLayerIsProcessing && (
        <img
          src={`${cdnBaseUrl}/${editModel.thumbnailPath}`}
          alt="Layer Image"
          width="256px"
          height="auto"
        />
      )}
      {!editModel.imagePath && !activeLayerIsProcessing && (
        <>
          <UploadsPanel
            triggerUpload={triggerUpload}
            onUploadComplete={async (uploadKey: string) => {
              setTriggerUpload(false);
              if (!activeMap) {
                return;
              }
              console.log('Processing Image', uploadKey);
              await ProcessImage({
                query: undefined,
                data: {
                  mapId: activeMap.id,
                  layerId: editModel.id,
                  uploadKey,
                },
              });
              layerActions.setLayerProcessing(editModel.id);
            }}
            onUploadError={() => setTriggerUpload(false)}
          />
          <Button
            className="new-layer-submit"
            type="submit"
            onClick={() => setTriggerUpload(true)}
          >
            Upload Image
          </Button>
        </>
      )}
      {activeLayerIsProcessing && !processingStatus && (
        <p className="processing-message">
          Image Processing in Progress. Please wait...
        </p>
      )}
      {activeLayerIsProcessing && processingStatus && (
        <div className="processing-status">
          <h5>Processing Status</h5>
          <p>{`Stage: ${processingStatus.stage}`}</p>
          <p>{`Percent Complete: ${processingStatus.percentComplete}`}</p>
          <p>{`Created At: ${processingStatus.createdAt}`}</p>
          <p>{`Last Updated: ${processingStatus.lastUpdated}`}</p>
          {processingStatus.error && (
            <p className="error">{`Error: ${processingStatus.error}`}</p>
          )}
          {processingStatus.message && (
            <p>{`Message: ${processingStatus.message}`}</p>
          )}
          {processingStatus.log?.map((log, i) => (
            <p key={`log-line-${i}`}>{log}</p>
          ))}
        </div>
      )}
    </Panel>
  );
};

export default LayerPanel;
