import { FC, useState } from 'react';
import { Dialog } from 'primereact/dialog';

import { post as createWorld } from '@api/bff/community/world';
import { Community } from '@shared/types/community';

import './index.scss';
import { Panel } from 'primereact/panel';

type NewWorldDialogProps = {
  community: Community;
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  onCreateSuccess: (world: any) => void;
  onCreateFailure: (error: any) => void;
};

const NewWorldDialog: FC<NewWorldDialogProps> = ({
  community,
  dialogVisible,
  setDialogVisible,
  onCreateSuccess,
  onCreateFailure,
}) => {
  const [worldName, setWorldName] = useState<string>('');
  const [worldDescription, setWorldDescription] = useState<string>('');

  const handleCreateWorld = async () => {
    console.log('Creating new world', worldName, worldDescription);
    if (worldName.trim() === '') {
      console.error('World name cannot be empty');
      onCreateFailure(new Error('World name cannot be empty'));
      return;
    }
    try {
      const newWorld = await createWorld({
        query: undefined,
        data: {
          name: worldName,
          description: worldDescription,
          communityId: community.id,
        },
      });
      onCreateSuccess(newWorld);
      setDialogVisible(false);
    } catch (error) {
      console.error('Failed to create world', error);
      onCreateFailure(error);
    }
  };

  return (
    <Dialog
      header={'Create a New World'}
      modal
      visible={dialogVisible}
      onHide={() => {
        setDialogVisible(false);
      }}
      content={() => (
        <Panel header={'Create a New World'} className="new-world-panel">
          <form className="new-world-form">
            <div className="form-row">
              <label htmlFor="world-name">World name</label>
              <input
                type="text"
                placeholder="World name"
                value={worldName}
                required
                onChange={e => setWorldName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="world-description">World description</label>
              <textarea
                placeholder="World description"
                value={worldDescription}
                onChange={e => setWorldDescription(e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="submit"
                onClick={async e => {
                  e.preventDefault();
                  await handleCreateWorld();
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

export default NewWorldDialog;
