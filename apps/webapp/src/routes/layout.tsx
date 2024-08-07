import { Outlet } from '@modern-js/runtime/router';
import { Provider } from '@modern-js/runtime/model';

import './reset.css';

export default function Layout() {
  return (
    <div className="layout-root">
      <Provider>
        <Outlet />
      </Provider>
    </div>
  );
}
