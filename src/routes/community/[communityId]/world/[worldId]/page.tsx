import { useEffect } from 'react';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { Panel } from 'primereact/panel';

import GetMaps from '@api/bff/community/[communityId]/world/[worldId]/maps';
import { AppModel } from '@/state/appModel';
import MapPanel from '@/components/map-panel';

import './page.scss';

const WorldPage: React.FC = () => {
  const [{ activeWorld, community, maps }, actions] = useModel(AppModel);
  const params = useParams();
  const navigate = useNavigate();

  console.log('Active World:', activeWorld);

  // TODO: Check params from URL against activeWorld and community, redirect or rebuild state if necessary

  useEffect(() => {
    if (!activeWorld || !community) {
      const { communityId, worldId } = params;
      if (!communityId || !worldId) {
        console.log('No community or world id');
        navigate('/communities');
      }
      // TODO: Actions to hydrate community and world data from ID's
    }
  }, []);

  useEffect(() => {
    if (community && activeWorld && activeWorld.mapIds.length > 0) {
      GetMaps(community.id, activeWorld.id, {
        query: { mapIds: [...activeWorld.mapIds] },
        data: undefined,
      }).then(maps => {
        console.log('maps data:', maps);
        actions.setMaps(maps);
      });
    } else {
      actions.clearMaps();
      console.log('No active world or community, or world contains no maps');
      console.log({ activeWorld, community, maps });
    }
  }, []);

  if (!activeWorld) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Panel
        className="world-details-panel"
        header={`World: ${activeWorld?.name}`}
      >
        <p>Status: {activeWorld?.status}</p>
        <p>Owner: {activeWorld?.owner.displayName}</p>
        <p>{activeWorld?.description}</p>
      </Panel>
      <MapPanel maps={maps} />
    </>
  );
};

export default WorldPage;
