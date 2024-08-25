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
  isAuthenticated: boolean;
  handleAuth: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContexts>({
  user: null,
  isAuthenticated: false,
  handleAuth: () => console.warn('No Auth Provider'),
  logout: () => console.warn('No Auth Provider'),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      console.log('Setting user and session from local storage');
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    }

    window.addEventListener('storage', () => {
      console.log('Storage event listener fired');
      const user = localStorage.getItem('user');
      console.log('User set from a different window', user);

      if (!user) {
        setUser(null);
        setIsAuthenticated(false);
      }
      if (user) {
        setUser(JSON.parse(user));
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
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  const logout = () => {
    console.log('Signing out user');
    setUser(null);
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
