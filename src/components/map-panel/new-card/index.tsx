import { useState } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { useModel } from '@modern-js/runtime/model';

import { post as createMap } from '@api/bff/community/[communityId]/world/[worldId]/map';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

const NewCard: React.FC = () => {
  const [{ community, activeWorld }, actions] = useModel(CommunityModel);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openNewMapDialog = () => {
    setDialogVisible(true);
  };

  const createNewMap = () => {
    console.log('Creating new map', name, description);
    if (name.trim() === '' || description.trim() === '') {
      console.error('name and description cannot be empty');
      return;
    }
    if (!community) {
      console.error('No community found');
      return;
    }
    const communityId = community.id;
    const worldId = activeWorld?.id || '';
    createMap(communityId, worldId, {
      query: undefined,
      data: {
        name,
        description,
      },
    }).then(newMap => {
      console.log('New map created', newMap);
      actions.addMap(newMap);
      setDialogVisible(false);
    });
  };

  return (
    <>
      <Card
        title={'Create a new map'}
        className="new-map-card"
        onClick={openNewMapDialog}
      >
        <p>+</p>
      </Card>
      <Dialog
        header={'Create a new Map'}
        modal
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
        }}
        content={() => (
          <form className="new-map-form">
            <label htmlFor="map-name">Map name</label>
            <input
              type="text"
              placeholder="Map name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <label htmlFor="map-description">Map description</label>
            <textarea
              placeholder="Map description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <input
              type="submit"
              onClick={e => {
                e.preventDefault();
                createNewMap();
              }}
              onSubmit={e => e.preventDefault()}
              value={'Create'}
            />
          </form>
        )}
      />
    </>
  );
};

export default NewCard;
