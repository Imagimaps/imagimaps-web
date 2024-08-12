import { Helmet } from '@modern-js/runtime/head';
import { useEffect } from 'react';
import GetAuthTokenLink from '@api/bff/auth/[provider]';
import { OAuth2Providers } from 'paper-glue';
import { useNavigate } from '@modern-js/runtime/router';

import ImagimapsSplash from '@assets/images/imagimaps_compressed.png';
import ImagimapsIco from '@assets/icons/imagimaps.ico';
import AuthDiscordCard from '@/components/auth-providers/discord-card';

import './index.css';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    GetAuthTokenLink(OAuth2Providers.Discord).then(res => {
      console.log(res);
    });
  }, []);

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
        <p className="description">
          Start exploring your worlds with Imagimaps!
        </p>
        <button onClick={() => navigate('/map/test_room/leaflet')}>
          Go to map engine dev playground
        </button>
        <div className="grid">
          <AuthDiscordCard />
        </div>
      </main>
    </div>
  );
};

export default Index;
