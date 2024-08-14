import { Link, useNavigate } from '@modern-js/runtime/router';

import logo from '@assets/icons/imagimaps.ico';
import { useAuth } from '@/hooks/auth';

import './index.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <div className="left">
        <img
          src={logo}
          id="header-logo"
          alt="Site Logo"
          onClick={() => navigate('/')}
        />
        <nav>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="user-head">
        {isAuthenticated ? (
          <>
            <span>{user?.name}</span>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <div>No User</div>
        )}
      </div>
    </header>
  );
};

export default Header;
