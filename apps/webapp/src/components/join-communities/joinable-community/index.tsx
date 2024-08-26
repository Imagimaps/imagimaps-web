import { Card } from 'primereact/card';
import { Community } from 'types/community';
import { Link, useNavigate } from '@modern-js/runtime/router';
import { post as joinCommunity } from '@api/bff/community/join';

import './index.css';

const JoinableCommunityCard: React.FC<Community> = community => {
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      await joinCommunity({ query: undefined, data: { id: community.id } });
      navigate(`community/${community.id}`, {
        state: { communityId: community.id },
      });
    } catch (error) {
      console.error('Failed to join community', error);
    }
  };

  return (
    <Card title={community.name} className="joinable-community-card">
      <img
        src={`https://cdn.discordapp.com/icons/${community.associatedGuildId}/${community.icon}`}
        onClick={handleJoin}
      />
      <Link to={`community/${community.id}`} onClick={handleJoin}>
        Join
      </Link>
      <p>Status: {community.status}</p>
      <p>Owner is: {community.owner.name}</p>
      <p>{community.description}</p>
    </Card>
  );
};

export default JoinableCommunityCard;
