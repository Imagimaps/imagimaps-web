import ServicesConfig from '@api/_config/services';
import { AuthCodeData, AuthCodeResponse, UserCredentials } from 'types/auth';
import { AuthorisationScopes } from 'types/authScopes.enums';

const { authServiceBaseUrl } = ServicesConfig();

const AuthClient = (userCredentials?: UserCredentials) => {
  const authenticateUser = async (
    data: AuthCodeData,
  ): Promise<AuthCodeResponse> => {
    const authResponse = await fetch(
      `${authServiceBaseUrl}/api/auth/user/authenticate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!authResponse.ok) {
      console.error('Failed to authenticate user', authResponse);
      throw new Error('Failed to authenticate user');
    }

    const userDetails = (await authResponse.json()) as AuthCodeResponse;
    if (!userDetails?.user && !userDetails?.session) {
      console.error('Failed to get user details', authResponse);
      throw new Error('Failed to get user details');
    }

    return userDetails;
  };

  const authoriseScope = async (scopes: AuthorisationScopes[]) => {
    console.log(`Authorising scopes: ${scopes.join(', ')}`);
    if (!userCredentials) {
      console.error('User credentials not provided');
      throw new Error('User credentials not provided');
    }

    return true; // TEMP: Remove this line when the function is implemented in AuthService
  };

  return {
    authenticateUser,
    authoriseScope,
  };
};

export default AuthClient;
