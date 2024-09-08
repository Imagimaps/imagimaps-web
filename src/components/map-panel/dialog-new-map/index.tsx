import { FC, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';

import { post as createMap } from '@api/bff/community/[communityId]/world/[worldId]/map';
import { Community } from '@shared/types/community';
import { World } from '@shared/types/world';

import './index.scss';

type NewMapDialogProps = {
  community: Community;
  world: World;
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  onCreateSuccess: (world: any) => void;
  onCreateFailure: (error: any) => void;
};

const NewMapDialog: FC<NewMapDialogProps> = ({
  community,
  world,
  dialogVisible,
  setDialogVisible,
  onCreateSuccess,
  onCreateFailure,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleCreate = async () => {
    console.log('Creating new map', name, description);
    if (name.trim() === '') {
      console.error('Map name cannot be empty');
      onCreateFailure(new Error('Map name cannot be empty'));
      return;
    }
    try {
      const communityId = community.id;
      const worldId = world.id;
      const newMap = await createMap(communityId, worldId, {
        query: undefined,
        data: {
          name,
          description,
        },
      });
      onCreateSuccess(newMap);
      setDialogVisible(false);
    } catch (error) {
      console.error('Failed to create map', error);
      onCreateFailure(error);
    }
  };

  return (
    <Dialog
      header={'Create a New Map'}
      modal
      visible={dialogVisible}
      onHide={() => {
        setDialogVisible(false);
      }}
      content={() => (
        <Panel header={'Create a New Map'} className="new-map-panel">
          <form className="new-map-form">
            <div className="form-row">
              <label htmlFor="map-name">Map name</label>
              <input
                type="text"
                placeholder="Map name"
                value={name}
                required
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="map-description">Map description</label>
              <textarea
                placeholder="Map description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="submit"
                onClick={async e => {
                  e.preventDefault();
                  await handleCreate();
                }}
                onSubmit={e => e.preventDefault()}
                value={'Create'}
              />
            </div>
          </form>
        </Panel>
      )}
    />
  );
};

export default NewMapDialog;
