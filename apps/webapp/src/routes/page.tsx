import { Helmet } from '@modern-js/runtime/head';
import { useEffect } from 'react';
import GetAuthTokenLink from '@api/bff/auth/[provider]';
import { OAuth2Providers } from 'paper-glue';
import { useNavigate } from '@modern-js/runtime/router';

import ImagimapsSplash from '@assets/images/imagimaps_compressed.png';
import ImagimapsIco from '@assets/icons/imagimaps.ico';
import AuthDiscordCard from '@/components/auth-providers/discord-card';
import { useAuth } from '@/hooks/auth';
import JoinCommunities from '@/components/join-communities';

import './index.css';
import Communities from '@/components/communities';

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    GetAuthTokenLink(OAuth2Providers.Discord).then(res => {
      console.log(res);
    });
  }, []);

  useEffect(() => {
    console.log('user', user, isAuthenticated);
  }, [user, isAuthenticated]);

  return (
    <div className="container-box">
      <Helmet>
        <link rel="icon" type="image/x-icon" href={ImagimapsIco} />
      </Helmet>
      <main>
        <div
          className="title-box central-content-box debug"
          style={{
            backgroundImage: `url(${ImagimapsSplash})`,
            backgroundSize: 'cover',
          }}
        >
          Imagimaps
        </div>
        {isAuthenticated && (
          <p className="description">Welcome back, {user?.name}!</p>
        )}
        <p className="description">
          Start exploring your worlds with Imagimaps!
        </p>
        <button onClick={() => navigate('/map/test_room/leaflet')}>
          Go to map engine dev playground
        </button>
        {!isAuthenticated && (
          <div className="grid">
            <AuthDiscordCard />
          </div>
        )}
        {isAuthenticated && <Communities />}
        {isAuthenticated && <JoinCommunities />}
      </main>
    </div>
  );
};

export default Index;
