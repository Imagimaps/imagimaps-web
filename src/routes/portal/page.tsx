import { useState } from 'react';
import { Panel } from 'primereact/panel';
import { useLoaderData } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';

import TileGrid from '@components/grid-panel';
import Tile from '@components/grid-panel/panel-card';
import { put as createWorld } from '@api/bff/user/[userId]/world';
import { World } from '@shared/types/world';

import worldPlaceholder from '@shared/images/world_image_placeholder_mini.png';
import type { PortalPageData } from './page.data';
import { AuthModel } from '@/state/authModel';
import NewWorldDialog from '@/components/dialogs/new-world';
import NewItemCard from '@/components/grid-panel/new-item-card';

const PortalPage: React.FC = () => {
  const data = useLoaderData() as PortalPageData;
  const [auth] = useModel(AuthModel);
  const [worlds, setWorlds] = useState<World[]>(data.userWorlds);
  const [newWorldDialogVisible, setNewWorldDialogVisible] = useState(false);

  return (
    <div>
      <NewWorldDialog
        dialogVisible={newWorldDialogVisible}
        setDialogVisible={setNewWorldDialogVisible}
        onSave={async (worldName, worldDescription) => {
          const userId = auth.user?.id;
          if (!userId) {
            console.error('No user id found');
            return;
          }
          console.log(
            'Creating new world',
            userId,
            worldName,
            worldDescription,
          );
          const newlyCreatedWorld = await createWorld(userId, {
            query: undefined,
            data: {
              name: worldName,
              description: worldDescription,
            },
          });
          console.log('New World created', newlyCreatedWorld);
          setWorlds([...worlds, newlyCreatedWorld]);
          setNewWorldDialogVisible(false);
        }}
      />
      <Panel>No notifications</Panel>
      <TileGrid header="Your Worlds" toggleable={{ open: true }}>
        {worlds.map((world, index) => (
          <Tile
            key={index}
            splashImage={world.coverImage ?? worldPlaceholder}
            title={world.name}
            content={world.description}
          />
        ))}
        <NewItemCard
          prompt="Create New World"
          onClick={() => setNewWorldDialogVisible(true)}
        />
      </TileGrid>
      <TileGrid header="Communities" toggleable={{ open: true }}>
        <div>
          <p>Communities Coming Soon</p>
        </div>
      </TileGrid>
    </div>
  );
};

export default PortalPage;
