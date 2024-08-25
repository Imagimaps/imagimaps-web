import { Card } from 'primereact/card';
import { JoinableCommunity } from 'types/community';

import './index.css';

const JoinableCommunityCard: React.FC<JoinableCommunity> = community => {
  return (
    <Card title={community.name} className="joinable-community-card">
      <img
        src={`https://cdn.discordapp.com/icons/${community.id}/${community.icon}`}
      />
      <p>{community.joinable ? 'Joinable' : 'Not Joinable'}</p>
      <p>{community.isOwner ? 'owner' : 'member'}</p>
      {community.size && <p>{community.size} members</p>}
    </Card>
  );
};

export default JoinableCommunityCard;
