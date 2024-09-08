import { useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useNavigate } from '@modern-js/runtime/router';

import { World } from '@shared/types/world';
import GridPanel from '@components/grid-panel';
import GridPanelCard from '@components/grid-panel/panel-card';
import NewItemCard from '@components/grid-panel/new-item-card';
// import { post as createWorld } from '@api/bff/community/world';
import NewWorldDialog from './dialog-new-world';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

interface WorldPanelProps {
  worlds: World[];
}

const WorldPanel: React.FC<WorldPanelProps> = ({ worlds }) => {
  const navigate = useNavigate();
  const [{ community }, actions] = useModel(CommunityModel);
  const [newItemDialogVisible, setNewItemDialogVisible] = useState(false);
  // const [worldName, setWorldName] = useState('');
  // const [worldDescription, worldMapDescription] = useState('');

  const handleWorldClicked = (world: World) => {
    console.log('Go to world', world?.id);
    actions.setViewingWorld(world);
    navigate(`/community/${community?.id}/world/${world.id}`);
  };

  const openNewItemDialog = () => {
    setNewItemDialogVisible(true);
  };

  return (
    <>
      <GridPanel header={'Community Worlds'} toggleable={{ open: true }}>
        {worlds.map(world => (
          <GridPanelCard
            key={world.id}
            title={world.name}
            splashImage={world.coverImage}
            subtitle={world.owner.displayName}
            content={world.description}
            onClick={() => handleWorldClicked(world)}
          />
        ))}
        <NewItemCard prompt="Add New World" onClick={openNewItemDialog} />
      </GridPanel>
      {community && (
        <NewWorldDialog
          community={community}
          dialogVisible={newItemDialogVisible}
          setDialogVisible={setNewItemDialogVisible}
          onCreateSuccess={(world: World) => {
            console.log('World created', world);
            actions.addWorld(world);
          }}
          onCreateFailure={() => {
            console.log('World creation failed');
          }}
        />
      )}
    </>
  );
};

export default WorldPanel;
