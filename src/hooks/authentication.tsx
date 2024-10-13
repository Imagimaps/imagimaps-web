import { useModel } from '@modern-js/runtime/model';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import { useContext, createContext, ReactNode, useEffect } from 'react';
import GetUserDetails from '@api/bff/user/details';
import { Session } from '@shared/types/auth';
import { AuthModel } from '@/state/authModel';

const AuthenticationContext = createContext({});

const AuthenticationProvider = ({ children }: { children: ReactNode }) => {
  const [{ user, isAuthenticated }, authActions] = useModel(AuthModel);

  useEffect(() => {
    GetUserDetails()
      .then(user => {
        console.log('Setting user and session from API', user.userDetails);
        authActions.setAuth(user, {} as Session);
      })
      .catch(() => {
        authActions.clearAuth();
      });
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      console.log('Setting user and session from local storage');
      authActions.setAuth(JSON.parse(user), {} as Session);
    }

    window.addEventListener('storage', () => {
      const user = localStorage.getItem('user');
      console.log('User set from a different window', user);

      if (!user) {
        authActions.clearAuth();
      } else {
        authActions.setAuth(JSON.parse(user), {} as Session);
      }
    });

    return () => {
      window.removeEventListener('storage', () => {
        console.log('Removing event listener');
      });
    };
  }, []);

  useEffect(() => {
    console.log('Auth User changed', user);
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    console.log('Auth state changed to', isAuthenticated);
    if (isAuthenticated) {
      console.log('Setting user in local storage');
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      console.log('Clearing user from local storage');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated]);

  return (
    <AuthenticationContext.Provider value={{}}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationProvider;

export const useAuth = () => {
  return useContext(AuthenticationContext);
};

export const RequireAuthentication = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [{ isAuthenticated }] = useModel(AuthModel);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    navigate('/login', {
      state: { from: location.pathname },
    });
  }

  return children;
};
