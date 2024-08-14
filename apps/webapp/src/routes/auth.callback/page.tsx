import { useSearchParams } from '@modern-js/runtime/router';
import { useEffect } from 'react';
import { post as submitToken } from '@api/bff/auth/[provider]';
import { OAuth2Providers } from 'paper-glue';
import { AuthCodeResponse } from 'types/auth';
import { useAuth } from '@/hooks/auth';

// Test url http://localhost:8080/auth/callback?code=eZm5KtzG1efj3yBBQci8RYcnTTWFad

const Callback = () => {
  const { handleAuth, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');
  const state = searchParams.get('state');
  console.log('Recieved code', code, 'with state', state);

  useEffect(() => {
    if (code) {
      const request = {
        provider: 'discord',
        code,
      };
      console.log('Submitting request', request);
      submitToken(OAuth2Providers.Discord, {
        query: undefined,
        data: request,
      }).then(res => {
        console.log('Submitted req', res);
        handleAuth(res as any as AuthCodeResponse);
      });
    }
  }, [code]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to /');
      window.close();
      // TODO: Countdown 5s then close window
      // window.close();
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <>
        <div>Signed in successfully!</div>
        <div>You may now close this window</div>
      </>
    );
  }

  return code ? (
    <div>
      Please wait whilst our management hamsters wake up and spin up our peoples
      register
    </div>
  ) : (
    <div>Something went wrong</div>
  );
};

export default Callback;
