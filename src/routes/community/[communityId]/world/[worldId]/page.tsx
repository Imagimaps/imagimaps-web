import { useModel } from '@modern-js/runtime/model';
import { Link, useParams } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import GetMaps from '@api/bff/community/[communityId]/world/[worldId]/map/[mapIds]';
import { CommunityModel } from '@/state/communityModel';
import MapPanel from '@/components/map-panel';

const WorldPage: React.FC = () => {
  const [{ activeWorld, community, maps }, actions] = useModel(CommunityModel);
  const params = useParams();

  console.log('Active World:', activeWorld);

  useEffect(() => {
    const { communityId, worldId } = params;
    if (
      (!activeWorld || !community) &&
      communityId &&
      worldId &&
      maps.length > 0
    ) {
      const mapIds = maps.map(map => map.id).join(',');
      GetMaps(communityId, worldId, mapIds).then(maps => {
        console.log('maps data:', maps);
        actions.setMaps(maps);
      });
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
