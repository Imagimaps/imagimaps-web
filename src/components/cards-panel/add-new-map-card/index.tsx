import { useState } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { useModel } from '@modern-js/runtime/model';

import { post as createMap } from '@api/bff/community/[communityId]/world';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

const AddNewMapCard: React.FC = () => {
  const [{ community, activeWorld }] = useModel(CommunityModel);
  const [visible, setVisible] = useState(false);
  const [mapName, setMapName] = useState('');
  const [mapDescription, setMapDescription] = useState('');

  const openNewWorldDialog = () => {
    setVisible(true);
  };

  const createNewMap = () => {
    console.log('Creating new map', mapName, mapDescription);
    if (mapName.trim() === '' || mapDescription.trim() === '') {
      console.error('World name and description cannot be empty');
      return;
    }
    if (!community || !activeWorld) {
      console.error('No community or world found');
      return;
    }
    createMap({
      query: undefined,
      data: {
        name: mapName,
        description: mapDescription,
        communityId: community.id,
        worldId: activeWorld.id,
      },
    });
    setVisible(false);
  };

  return (
    <>
      <Card
        title={'Create a new world'}
        className="new-word-card"
        onClick={openNewWorldDialog}
      >
        <p>+</p>
      </Card>
      <Dialog
        header={'Create a new World'}
        modal
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        content={() => (
          <form className="new-world-form">
            <label htmlFor="world-name">World name</label>
            <input
              type="text"
              placeholder="World name"
              value={mapName}
              onChange={e => setMapName(e.target.value)}
            />
            <label htmlFor="world-description">World description</label>
            <textarea
              placeholder="World description"
              value={mapDescription}
              onChange={e => setMapDescription(e.target.value)}
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

export default AddNewMapCard;
