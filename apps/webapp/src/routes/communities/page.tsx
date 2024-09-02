import { Link } from '@modern-js/runtime/router';

import GetJoinedCommunities from '@api/bff/communities/member';
import { Community } from '@shared/types/community';
import { useEffect, useState } from 'react';

const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    GetJoinedCommunities().then(communities => {
      setCommunities(communities);
    });
  }, []);

  return (
    <div>
      <h1>Communities Page</h1>
      <div>
        <h2>Test Community</h2>
        <Link to="/cartography/0">Go to community</Link>
      </div>
      {communities.map(community => (
        <div key={community.id}>
          <h3>{community.name}</h3>
          <p>{community.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunitiesPage;
