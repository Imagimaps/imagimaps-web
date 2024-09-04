import { Panel } from 'primereact/panel';
import GetCommunitiesToJoin from '@api/bff/communities/search';
import { useEffect, useState } from 'react';
import { Community } from '@shared/types/community';
import JoinableCommunityCard from './joinable-community';

import './index.css';

const JoinCommunities: React.FC = () => {
  const [joinableCommunities, setJoinableCommunities] = useState<Community[]>(
    [],
  );

  useEffect(() => {
    GetCommunitiesToJoin().then((res: Community[]) => {
      setJoinableCommunities(res);
    });
  }, []);

  const headerTemplate = (
    <div id="joinable-community-panel-header">
      <h2>Join a community</h2>
      <button>Explore more</button>
    </div>
  );

  return (
    <Panel
      id="joinable-community-panel"
      headerTemplate={headerTemplate}
      toggleable
    >
      {joinableCommunities.map(community => (
        <JoinableCommunityCard key={community.id} {...community} />
      ))}
    </Panel>
  );
};

export default JoinCommunities;
