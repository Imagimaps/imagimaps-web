import { Outlet } from '@modern-js/runtime/router';
import { Provider } from '@modern-js/runtime/model';

import AuthProvider from '../hooks/auth';

import './reset.css';
import Header from '@/components/header';

export default function Layout() {
  return (
    <AuthProvider>
      <div className="layout-root">
        <Provider>
          <Header />
          <Outlet />
        </Provider>
      </div>
    </AuthProvider>
  );
}
