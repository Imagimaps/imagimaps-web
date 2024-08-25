import { useLocation, useNavigate } from '@modern-js/runtime/router';
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { User } from 'types/user';

export type AuthContexts = {
  user: User | null;
  // session: { id: string; expiry: string } | null;
  isAuthenticated: boolean;
  handleAuth: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContexts>({
  user: null,
  // session: null,
  isAuthenticated: false,
  handleAuth: () => console.warn('No Auth Provider'),
  logout: () => console.warn('No Auth Provider'),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const session = localStorage.getItem('session');

    if (user && session) {
      console.log('Setting user and session from local storage');
      setUser(JSON.parse(user));
      // setSession(JSON.parse(session));
      setIsAuthenticated(true);
    }

    window.addEventListener('storage', () => {
      console.log('Storage event listener fired');
      const user = localStorage.getItem('user');
      // const session = localStorage.getItem('session');
      console.log(
        'User set from a different window',
        user,
        // session,
      );

      if (!user) {
        setUser(null);
        // setSession(null);
        setIsAuthenticated(false);
      }
      if (user) {
        setUser(JSON.parse(user));
        // setSession(JSON.parse(session));
        setIsAuthenticated(true);
      }
    });

    return () => {
      window.removeEventListener('storage', () => {
        console.log('Removing event listener');
      });
    };
  }, []);

  const handleAuth = (user: User) => {
    console.log('Authenticating user', user);
    if (user) {
      setUser(user);
      // setSession(user);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(user));
      // localStorage.setItem('session', JSON.stringify(user.session));
    }
  };

  const logout = () => {
    console.log('Signing out user');
    setUser(null);
    // setSession(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('session');
    // TODO: Post back invalidate session to auth service
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, handleAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated) {
    navigate('/login', {
      state: { from: location.pathname },
    });
  }

  return children;
};
