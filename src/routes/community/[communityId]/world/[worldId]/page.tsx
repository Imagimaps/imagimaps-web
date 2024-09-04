import { useModel } from '@modern-js/runtime/model';
import { Link, useParams } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import GetWorldData from '@api/bff/community/[communityId]/world/[worldId]';
import { CommunityModel } from '@/state/communityModel';

const WorldPage: React.FC = () => {
  const [{ activeWorld, community }, actions] = useModel(CommunityModel);
  const params = useParams();
  // const navigate = useNavigate();

  useEffect(() => {
    const { communityId, worldId } = params;
    if ((!activeWorld || !community) && communityId && worldId) {
      GetWorldData(communityId, worldId).then(world => {
        console.log('World data:', world);
        actions.setWorlds([world]);
        actions.setActiveWorld(world);
      });
    }
  }, []);

  if (!activeWorld) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{activeWorld.name}</h1>
      <p>{activeWorld.description}</p>
      <Link to="edit">Edit</Link>
    </div>
  );
};

export default WorldPage;
