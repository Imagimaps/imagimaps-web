import { Link, useParams } from '@modern-js/runtime/router';
import GetCommunityDetails from '@api/bff/community/[communityId]';
import { useEffect } from 'react';
import { useModel } from '@modern-js/runtime/model';
import GetWorlds from '@api/bff/community/[communityId]/worlds';
import WorldPanel from '@/components/world-panel';
import { CommunityModel } from '@/state/communityModel';

const CommunityPage: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [{ community, worlds }, actions] = useModel(CommunityModel);

  useEffect(() => {
    if (communityId) {
      GetCommunityDetails(communityId).then(cmnty => {
        console.log('Community details retrieved', cmnty);
        actions.setCommunity(cmnty);
      });
    } else {
      console.error('No community id found');
    }
  }, []);

  useEffect(() => {
    if (communityId) {
      GetWorlds(communityId).then((worlds: any) => {
        console.log('Worlds retrieved', worlds);
        actions.setWorlds(worlds);
      });
    }
  }, [communityId]);

  return (
    <div>
      <h1>Community Page</h1>
      <div>
        <h2>Test World</h2>
        <Link to="0">Go to world</Link>
      </div>
      <div>
        <h2>Community Details</h2>
        {community ? (
          <div>
            <h3>{community.name}</h3>
            <p>{community.description}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        {worlds ? <WorldPanel worlds={worlds} /> : <p>Loading Worlds...</p>}
      </div>
    </div>
  );
};

export default CommunityPage;
