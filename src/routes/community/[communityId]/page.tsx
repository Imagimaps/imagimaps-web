import { useEffect } from 'react';
import { useParams } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { Panel } from 'primereact/panel';

import GetCommunityDetails from '@api/bff/community/[communityId]';
import GetWorlds from '@api/bff/community/[communityId]/worlds';
import WorldPanel from '@/components/world-panel';
import { AppModel } from '@/state/appModel';

import './page.scss';

const CommunityPage: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [{ community, worlds }, actions] = useModel(AppModel);

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
    <>
      <Panel
        className="community-details-panel"
        header={`Community: ${community?.name}`}
      >
        <p>Status: {community?.status}</p>
        <p>Owner: {community?.owner.displayName}</p>
        <p>Admins: {community?.admins.map(u => u.displayName)}</p>
        <p>{community?.description}</p>
      </Panel>
      <WorldPanel worlds={worlds} />
    </>
  );
};

export default CommunityPage;
