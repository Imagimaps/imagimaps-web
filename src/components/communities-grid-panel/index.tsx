import { FC, useEffect, useState } from 'react';

import GetCommunitiesToJoin from '@api/bff/communities/search';
import GridPanel from '@components/grid-panel';
import { Community } from '@shared/types/community';
import { useNavigate } from '@modern-js/runtime/router';
import { post as joinCommunity } from '@api/bff/community/join';
import GridPanelCard from '../grid-panel/panel-card';

import './index.scss';

const CommunityGridPanel: FC = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    GetCommunitiesToJoin().then((res: Community[]) => {
      setCommunities(res);
    });
  }, []);

  const handleCommunityClicked = async (community: Community) => {
    try {
      await joinCommunity({ query: undefined, data: { id: community.id } });
      navigate(`community/${community.id}`, {
        state: { communityId: community.id },
      });
    } catch (error) {
      console.error('Failed to join community', error);
    }
  };

  const panelHeader = (
    <div className="community-grid-panel-header">
      <h2>Your Communities</h2>
      <button>Explore more (todo)</button>
    </div>
  );

  return (
    <GridPanel header={panelHeader} toggleable={false}>
      {communities.map(community => (
        <GridPanelCard
          key={community.id}
          title={community.name}
          splashImage={`https://cdn.discordapp.com/icons/${community.associatedGuildId}/${community.icon}`}
          content={community.description}
          onClick={async () => await handleCommunityClicked(community)}
        />
      ))}
    </GridPanel>
  );
};

export default CommunityGridPanel;
