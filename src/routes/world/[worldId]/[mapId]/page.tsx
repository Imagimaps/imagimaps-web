import { FC, useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigate } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { OrderList } from 'primereact/orderlist';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import Fingerprint from '@shared/svg/fingerprint.svg';
import LayersSvg from '@shared/svg/layers.svg';
import { LayerStatus, MapLayer } from '@shared/_types';
import { post as updateMap } from '@api/bff/user/world/[worldId]/map';
import { put as createLayer } from '@api/bff/user/map/[mapId]/layer';
import { DELETE as DeleteMap } from '@api/bff/user/map/[mapId]';
import { NewLayer } from '@shared/_defaults';
import { UserMapData } from './page.data';
import { LayerModel } from './_state/layers';
import { AppModel } from '@/state/appModel';
import EntityPanel from '@/components/entity-panel';
import EditableTitleRow from '@/components/editable-rows/title';
import EditableTextAreaRow from '@/components/editable-rows/text-area';
import LayerPanel from '@/components/panels/layer';
import SvgIcon from '@/components/icon/svg';

import './page.scss';

const MapPage: FC = () => {
  const [{ activeMap, activeWorld }, actions] = useModel(AppModel);
  const [layersModel, layersActions] = useModel(LayerModel);
  const data = useLoaderData() as UserMapData;
  const navigate = useNavigate();

  const [liveMapModel, setLiveMapModel] = useState(activeMap);
  const [editEnabledFields, setEditEnabledFields] = useState({
    name: false,
    description: false,
  });
  const [mapHasChanges, setMapHasChanges] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    console.log('Setting active map', data.map);
    layersActions.initialise(data.map);
    actions.setActiveMap(data.map);
  }, [data.map]);

  useEffect(() => {
    console.log('Active Map Changed', activeMap);
    setLiveMapModel(activeMap);
  }, [activeMap]);

  useEffect(() => {
    console.log('Live Map Model Changed', liveMapModel);
    if (liveMapModel) {
      console.log('Checking for changes', activeMap, liveMapModel);
      const { name, description } = liveMapModel.intrinsics;
      let hasChanges = false;
      if (name !== activeMap?.intrinsics.name) {
        hasChanges = true;
      }
      if (description !== activeMap?.intrinsics.description) {
        hasChanges = true;
      }
      setMapHasChanges(hasChanges);
    }
  }, [liveMapModel]);

  const layersHeader = (
    <>
      <div className="header-content">
        <SvgIcon src={LayersSvg} alt="Layers" />
        <h4>Layers</h4>
      </div>
      <Button
        icon="pi pi-plus"
        label="Add Layer"
        onClick={async () => {
          console.log('Add Layer');
          if (!liveMapModel) {
            return;
          }
          const newLayer = await createLayer(liveMapModel.id, {
            query: undefined,
            data: { layer: NewLayer(layersModel.layerCount) },
          });
          layersActions.addLayer(newLayer);
          layersActions.setActiveLayer(newLayer);
        }}
      />
    </>
  );

  const layerTemplate = (layer: MapLayer) => {
    console.log('Rendering Layer Template', layer);
    const { changedLayers } = layersModel;

    const layerHasChanges = changedLayers.some(l => l.id === layer.id);
    return (
      <div
        onClick={() => {
          console.log('Clicked on ', layer.name, layer.id);
          layersActions.setActiveLayer(layer);
        }}
      >
        <p>{layer.name}</p>
        {layer.isDefault && <Badge value="Default" className="mini" />}
        {layer.status === LayerStatus.DRAFT && (
          <Badge value="Draft" severity="secondary" className="mini" />
        )}
        {layerHasChanges && (
          <Badge value="Unsaved Changes" severity="danger" className="mini" />
        )}
      </div>
    );
  };

  if (!liveMapModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="map-page page-content">
      <Toast ref={toast} />
      <EntityPanel
        title="Map Info"
        entityHasChanges={mapHasChanges}
        onSaveChanges={async () => {
          if (!activeWorld) {
            return;
          }
          if (!liveMapModel) {
            return;
          }
          try {
            console.log('Saving Changes', liveMapModel);
            toast.current?.show({
              severity: 'info',
              summary: 'Saving Map',
              detail: 'Saving your changes...',
            });
            const updatedMap = await updateMap(activeWorld.id, {
              query: undefined,
              data: { map: liveMapModel },
            });
            actions.updateMap(updatedMap);
            actions.setActiveMap(updatedMap);
            toast.current?.show({
              severity: 'success',
              summary: 'Map Saved',
              detail: 'Your changes have been saved',
            });
          } catch (err) {
            console.error('Error Saving Map', err);
            toast.current?.show({
              severity: 'error',
              summary: 'Error Saving Map',
              detail: 'An error occurred while saving your changes',
            });
          }
        }}
        onUndoChanges={async () => {
          setLiveMapModel(activeMap);
          setEditEnabledFields({ name: false, description: false });
        }}
      >
        <div className="metadata-row">
          <SvgIcon src={Fingerprint} alt="Fingerprint" />
          <p className="metadata">{liveMapModel.id}</p>
        </div>

        <p className="metadata">Name</p>
        <EditableTitleRow
          value={liveMapModel.intrinsics.name}
          editMode={editEnabledFields.name}
          valueChanged={
            liveMapModel.intrinsics.name !== activeMap?.intrinsics.name
          }
          onEditEnable={() => {
            setEditEnabledFields({ ...editEnabledFields, name: true });
          }}
          onChange={value => {
            setLiveMapModel({
              ...liveMapModel,
              intrinsics: { ...liveMapModel.intrinsics, name: value },
            });
          }}
          onUndo={() => {
            setLiveMapModel({
              ...liveMapModel,
              intrinsics: {
                ...liveMapModel.intrinsics,
                name: activeMap?.intrinsics.name ?? '',
              },
            });
            setEditEnabledFields({ ...editEnabledFields, name: false });
          }}
        />

        <EditableTextAreaRow
          value={liveMapModel.intrinsics.description ?? ''}
          label="Description"
          editMode={editEnabledFields.description}
          valueChanged={
            liveMapModel.intrinsics.description !==
            activeMap?.intrinsics.description
          }
          onEditEnable={() => {
            setEditEnabledFields({ ...editEnabledFields, description: true });
          }}
          onChange={value => {
            setLiveMapModel({
              ...liveMapModel,
              intrinsics: { ...liveMapModel.intrinsics, description: value },
            });
          }}
          onUndo={() => {
            setLiveMapModel({
              ...liveMapModel,
              intrinsics: {
                ...liveMapModel.intrinsics,
                description: activeMap?.intrinsics.description ?? '',
              },
            });
            setEditEnabledFields({ ...editEnabledFields, description: false });
          }}
        />
        {layersModel?.activeLayerIsWorkable ? (
          <Button
            onClick={() =>
              navigate(`workspace?layer=${layersModel.activeLayer?.id}`, {
                state: { userMetadata: data.metadata },
              })
            }
          >
            {' '}
            Enter Map{' '}
          </Button>
        ) : (
          <Button disabled> Enter Map </Button>
        )}
        <Panel
          toggleable={true}
          collapsed={true}
          header={
            <div className="header">
              <p>Warning! Controls</p>
            </div>
          }
        >
          <Button
            label="Delete Map"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={() => {
              console.log('Delete Map', liveMapModel.id);
              DeleteMap(liveMapModel.id)
                .then(() => {
                  toast.current?.show({
                    severity: 'success',
                    summary: 'Map Deleted',
                  });
                  navigate('..', { relative: 'path' });
                })
                .catch(error => {
                  console.error('Failed to delete map', error);
                  toast.current?.show({
                    severity: 'error',
                    summary: 'Failed to delete map',
                  });
                });
            }}
          />
        </Panel>
      </EntityPanel>
      <Panel header={layersHeader} className="map-layers-panel">
        <Splitter className="map-layers-split-panel">
          <SplitterPanel size={25} minSize={10} style={{ overflow: 'auto' }}>
            <OrderList
              dataKey="id"
              value={layersModel.layers}
              onChange={e => console.log('OL Val', e.value)}
              itemTemplate={layerTemplate}
              filter
              filterBy="name"
            />
          </SplitterPanel>
          <SplitterPanel size={75} minSize={10}>
            {layersModel.activeLayer ? (
              <LayerPanel />
            ) : (
              <Panel>No Layer Selected</Panel>
            )}
          </SplitterPanel>
        </Splitter>
      </Panel>
    </div>
  );
};

export default MapPage;
