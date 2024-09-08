import { Link, useNavigate } from '@modern-js/runtime/router';

import logo from '@assets/icons/imagimaps.ico';
import { useModel } from '@modern-js/runtime/model';
import { AuthModel } from '@/state/authModel';

import './index.scss';

const Header: React.FC = () => {
  const [{ user, isAuthenticated }, authActions] = useModel(AuthModel);

  const navigate = useNavigate();

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
            <li>
              <Link to="/pricing">Pricing</Link>
            </li>
            <li>
              <Link to="/map/test_room/leaflet">Map Engine</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="right">
        <div id="user-head">
          {isAuthenticated ? (
            <>
              <span>{user?.name}</span>
              <button onClick={() => authActions.clearAuth()}>Logout</button>
            </>
          ) : (
            <Link to="/login">Log In</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
