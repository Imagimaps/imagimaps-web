import { useEffect, useRef, useState } from 'react';
import { useLoaderData, useNavigate } from '@modern-js/runtime/router';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import SvgIcon from '@components/icon/svg';
import TileGrid from '@components/grid-panel';
import Tile from '@components/grid-panel/panel-card';
import { useModel } from '@modern-js/runtime/model';
import {
  post as UpdateWorld,
  DELETE as DeleteWorld,
} from '@api/bff/user/world/[worldId]';
import { put as CreateMap } from '@api/bff/user/world/[worldId]/map';

import Fingerprint from '@shared/svg/fingerprint.svg';
import MapPlaceholder from '@shared/images/map_image_placeholder_mini.png';
import { UserWorldData } from './page.data';
import NewMapDialog from '@/components/dialogs/new-map';
import { AppModel } from '@/state/appModel';
import EditableTextAreaRow from '@/components/editable-rows/text-area';
import NewItemCard from '@/components/grid-panel/new-item-card';
import EditableTitleRow from '@/components/editable-rows/title';

import './page.scss';

const UserWorldPage: React.FC = () => {
  const navigate = useNavigate();
  const [{ activeWorld, maps }, actions] = useModel(AppModel);
  const data = useLoaderData() as UserWorldData;

  const [newMapDialogVisible, setNewMapDialogVisible] = useState(false);
  const [liveWorldModel, setLiveWorldModel] = useState(activeWorld);
  const [editEnabledFields, setEditEnabledFields] = useState({
    name: false,
    description: false,
  });
  const [worldHasChanges, setWorldHasChanges] = useState(false);

  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (data.world) {
      actions.addWorld(data.world);
      actions.setViewingWorld(data.world);
      actions.setMaps(data.world.maps ?? []);
      setLiveWorldModel(data.world);
    }
  }, [data.world]);

  useEffect(() => {
    if (liveWorldModel) {
      console.log('Checking for changes', activeWorld, liveWorldModel);
      let hasChanges = false;
      if (liveWorldModel.intrinsics.name !== activeWorld?.intrinsics.name) {
        hasChanges = true;
      }
      if (
        liveWorldModel.intrinsics.description !==
        activeWorld?.intrinsics.description
      ) {
        hasChanges = true;
      }
      setWorldHasChanges(hasChanges);
    }
  }, [liveWorldModel]);

  const createNewMap = async (mapName: string, mapDescription: string) => {
    console.log('Creating new map', mapName, mapDescription);
    toast.current?.show({
      severity: 'info',
      summary: 'Creating Map',
    });
    const worldId = activeWorld?.id;
    if (!worldId) {
      console.error('No active world to create map in');
      toast.current?.show({
        severity: 'error',
        summary: 'Failed to create map',
      });
      return;
    }
    try {
      const newMap = await CreateMap(worldId, {
        query: undefined,
        data: { name: mapName, description: mapDescription },
      });
      actions.addMap(newMap);
      toast.current?.show({
        severity: 'success',
        summary: 'Map Created',
      });
    } catch (error) {
      console.error('Failed to create map', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Failed to create map',
      });
    }
    setNewMapDialogVisible(false);
  };

  if (!liveWorldModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="page-content">
      <Toast ref={toast} />
      <NewMapDialog
        dialogVisible={newMapDialogVisible}
        setDialogVisible={setNewMapDialogVisible}
        onSave={createNewMap}
      />
      <Panel
        header={
          <div className="header">
            <p>World Details</p>
            {worldHasChanges && (
              <div className="actions">
                <Button
                  severity="danger"
                  icon="pi pi-times"
                  onClick={() => {
                    setLiveWorldModel(activeWorld);
                    setEditEnabledFields({ name: false, description: false });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  icon="pi pi-save"
                  onClick={async () => {
                    console.log('Save world', liveWorldModel);
                    toast.current?.show({
                      severity: 'info',
                      summary: 'Saving World',
                    });
                    try {
                      const updatedWorld = await UpdateWorld(
                        liveWorldModel.id,
                        {
                          query: undefined,
                          data: {
                            name: liveWorldModel.intrinsics.name,
                            description:
                              liveWorldModel.intrinsics.description ?? '',
                          },
                        },
                      );
                      actions.updateWorld(updatedWorld);
                      actions.setViewingWorld(updatedWorld);
                      setLiveWorldModel(updatedWorld);
                      setEditEnabledFields({ name: false, description: false });
                      toast.current?.show({
                        severity: 'success',
                        summary: 'World Saved',
                      });
                    } catch (error) {
                      console.error('Failed to save world', error);
                      toast.current?.show({
                        severity: 'error',
                        summary: 'Failed to save world',
                      });
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
        }
        className="world-details-panel"
      >
        <EditableTitleRow
          value={liveWorldModel.intrinsics.name}
          editMode={editEnabledFields.name}
          valueChanged={
            liveWorldModel.intrinsics.name !== activeWorld?.intrinsics.name
          }
          onEditEnable={() => {
            setEditEnabledFields({ ...editEnabledFields, name: true });
          }}
          onChange={value => {
            setLiveWorldModel({
              ...liveWorldModel,
              intrinsics: { ...liveWorldModel.intrinsics, name: value },
            });
          }}
          onUndo={() => {
            setLiveWorldModel({
              ...liveWorldModel,
              intrinsics: {
                ...liveWorldModel.intrinsics,
                name: activeWorld?.intrinsics.name ?? '',
              },
            });
          }}
        />
        <div className="metadata-row">
          <SvgIcon src={Fingerprint} alt="Fingerprint" />
          <p className="metadata">{liveWorldModel.id}</p>
        </div>
        <EditableTextAreaRow
          value={liveWorldModel.intrinsics.description ?? ''}
          editMode={editEnabledFields.description}
          valueChanged={
            liveWorldModel.intrinsics.description !==
            activeWorld?.intrinsics.description
          }
          onEditEnable={() => {
            setEditEnabledFields({ ...editEnabledFields, description: true });
          }}
          onChange={value => {
            setLiveWorldModel({
              ...liveWorldModel,
              intrinsics: { ...liveWorldModel.intrinsics, description: value },
            });
          }}
          onUndo={() => {
            setLiveWorldModel({
              ...liveWorldModel,
              intrinsics: {
                ...liveWorldModel.intrinsics,
                description: activeWorld?.intrinsics.description ?? '',
              },
            });
          }}
        />
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
            label="Delete World"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={() => {
              console.log('Delete World', liveWorldModel.id);
              DeleteWorld(liveWorldModel.id)
                .then(() => {
                  toast.current?.show({
                    severity: 'success',
                    summary: 'World Deleted',
                  });
                  navigate('/worlds');
                })
                .catch(error => {
                  console.error('Failed to delete world', error);
                  toast.current?.show({
                    severity: 'error',
                    summary: 'Failed to delete world',
                  });
                });
            }}
          />
        </Panel>
      </Panel>
      <TileGrid header="Your Maps">
        {maps?.map((map, index) => (
          <Tile
            key={index}
            splashImage={map.intrinsics.splashImage ?? MapPlaceholder}
            title={map.intrinsics.name}
            subtitle={map.id}
            content={map.intrinsics.description}
            onClick={() => {
              console.log('Go to Map', map.id);
              navigate(`${map.id}`);
            }}
          />
        ))}
        <NewItemCard
          prompt="Create New Map"
          onClick={() => setNewMapDialogVisible(true)}
        />
      </TileGrid>
    </div>
  );
};

export default UserWorldPage;
