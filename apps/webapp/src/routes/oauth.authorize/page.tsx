import { useSearchParams } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import { post as submitToken } from '@api/bff/auth/[provider]';
import { OAuth2Providers } from 'paper-glue';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('code');
  console.log('Recieved token', token);

  useEffect(() => {
    if (token) {
      const request = {
        provider: 'discord',
        token,
      };
      console.log('Submitting request', request);
      submitToken(OAuth2Providers.Discord, {
        query: undefined,
        data: request,
      }).then(res => {
        console.log('Submitted req', res);
      });
    }
  }, [token]);

  return token ? (
    <div>
      Please wait whilst our management hamsters wake up and spin up our peoples
      register
    </div>
  ) : (
    <div>Something went wrong</div>
  );
};

export default Callback;
