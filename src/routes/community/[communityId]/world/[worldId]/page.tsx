import { useModel } from '@modern-js/runtime/model';
import { Link, useNavigate, useParams } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import GetMaps from '@api/bff/community/[communityId]/world/[worldId]/maps';
import { CommunityModel } from '@/state/communityModel';
import MapPanel from '@/components/map-panel';

const WorldPage: React.FC = () => {
  const [{ activeWorld, community, maps }, actions] = useModel(CommunityModel);
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
    <div>
      <h1>World Page</h1>
      <h2>{activeWorld.name}</h2>
      <p>{activeWorld.description}</p>
      <Link to="edit">Edit</Link>
      <MapPanel maps={maps} />
    </div>
  );
};

export default WorldPage;
