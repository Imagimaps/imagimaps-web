import { Helmet } from '@modern-js/runtime/head';
import { useEffect } from 'react';
import GetAuthTokenLink from '@api/bff/auth/[provider]';
import { useNavigate } from '@modern-js/runtime/router';

import { OAuth2Providers } from '@shared/types/auth.enums';
// import ImagimapsSplash from '@assets/images/imagimaps_compressed.png';
import ImagimapsIco from '@assets/icons/imagimaps.ico';
import { useModel } from '@modern-js/runtime/model';
import AuthDiscordCard from '@/components/auth-providers/discord-card';
import { AuthModel } from '@/state/authModel';
import CommunityGridPanel from '@/components/communities-grid-panel';

import './index.css';

const Index = () => {
  const navigate = useNavigate();
  const [{ isAuthenticated, user }] = useModel(AuthModel);

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
        <div className="title-box central-content-box debug">
          <h1>Imagimaps</h1>
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
        {isAuthenticated && <CommunityGridPanel />}
      </main>
    </div>
  );
};

export default Index;
