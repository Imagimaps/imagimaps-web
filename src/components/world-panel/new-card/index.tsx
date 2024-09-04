import { useState } from 'react';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { useModel } from '@modern-js/runtime/model';

import { post as createWorld } from '@api/bff/community/world';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

const NewCard: React.FC = () => {
  const [{ community }] = useModel(CommunityModel);
  const [visible, setVisible] = useState(false);
  const [worldName, setWorldName] = useState('');
  const [worldDescription, setWorldDescription] = useState('');

  const openNewWorldDialog = () => {
    setVisible(true);
  };

  const createNewWorld = () => {
    console.log('Creating new world', worldName, worldDescription);
    if (worldName.trim() === '' || worldDescription.trim() === '') {
      console.error('World name and description cannot be empty');
      return;
    }
    if (!community) {
      console.error('No community found');
      return;
    }
    createWorld({
      query: undefined,
      data: {
        name: worldName,
        description: worldDescription,
        communityId: community.id,
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
              value={worldName}
              onChange={e => setWorldName(e.target.value)}
            />
            <label htmlFor="world-description">World description</label>
            <textarea
              placeholder="World description"
              value={worldDescription}
              onChange={e => setWorldDescription(e.target.value)}
            />
            <input
              type="submit"
              onClick={e => {
                e.preventDefault();
                createNewWorld();
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
