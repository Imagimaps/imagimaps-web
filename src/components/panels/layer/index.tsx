import { Panel } from 'primereact/panel';
import { FC, useState } from 'react';
import { Button } from 'primereact/button';
import { useModel } from '@modern-js/runtime/model';
import { LayerStatus } from '@shared/_types';
import EditableTitleRow from '@/components/editable-rows/title';
import EditableTextAreaRow from '@/components/editable-rows/text-area';
import UploadsPanel from '@/components/upload-panel';
import { LayerModel } from '@/routes/world/[worldId]/[mapId]/_state/layers';

import './index.scss';

const LayerPanel: FC = () => {
  const [triggerUpload, setTriggerUpload] = useState(false);

  const [
    { activeLayer, layers, editState, fieldHasChanged, currentLayerHasChanges },
    layerActions,
  ] = useModel(LayerModel);
  const layerId = activeLayer?.id;
  const editModel = layers.find(l => l.id === layerId);
  const fieldEditState = editState.get(layerId ?? '');

  const createNewLayer = async (uploadKey: string) => {
    console.log('Create New Layer', activeLayer, uploadKey);
    // const newLayer = await CreateLayer(
    //   community?.id,
    //   activeWorld?.id,
    //   activeMap?.id,
    //   {
    //     query: undefined,
    //     data: { uploadKey, layer },
    //   },
    // );
  };

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
            onClick={() => console.log('Save Layer')}
          >
            Save
          </Button>
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text"
            onClick={() => console.log('Delete Layer')}
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
      {editModel.imagePath ? (
        <div>Image Uploaded</div>
      ) : (
        <>
          <UploadsPanel
            triggerUpload={triggerUpload}
            onUploadComplete={createNewLayer}
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
    </Panel>
  );
};

export default LayerPanel;
