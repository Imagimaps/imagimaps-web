import React, { useState, useEffect } from 'react';
import GetAuthTokenLink from '@api/bff/auth/[provider]';
import { Blocks } from 'react-loader-spinner';
import { OAuth2Providers } from '@shared/types/auth.enums';

const AuthDiscordCard: React.FC = () => {
  const [linkUrl, setLinkUrl] = useState<string>('');

  useEffect(() => {
    GetAuthTokenLink(OAuth2Providers.Discord).then(res => {
      console.log(res);
      setLinkUrl(res.tokenLink);
    });
  }, []);

  // Use Suspense
  return linkUrl ? (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card"
    >
      <h2>
        Log in with Discord
        <img
          className="arrow-right"
          src="https://lf3-static.bytednsdoc.com/obj/eden-cn/zq-uylkvT/ljhwZthlaukjlkulzlp/arrow-right.svg"
        />
      </h2>
    </a>
  ) : (
    <div className="card">
      <Blocks
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{
          display: 'block',
          margin: 'auto',
        }}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </div>
  );
};

export default AuthDiscordCard;
