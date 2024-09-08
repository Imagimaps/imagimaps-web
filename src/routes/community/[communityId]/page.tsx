import { useParams } from '@modern-js/runtime/router';
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
      GetCommunityDetails(communityId).then(c => {
        console.log('Community details retrieved', c);
        actions.setCommunity(c);
      });
    } else {
      console.error('No community id found');
    }
  }, []);

  useEffect(() => {
    if (communityId && communityId !== community?.id) {
      GetWorlds(communityId).then((worlds: any) => {
        console.log('Worlds retrieved', worlds);
        actions.setWorlds(worlds);
      });
    }
  }, [communityId]);

  return (
    <div>
      <h1>Community: {community?.name}</h1>
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
      </div>
      <WorldPanel worlds={worlds} />
    </div>
  );
};

export default CommunityPage;
