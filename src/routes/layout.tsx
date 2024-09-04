import { Outlet } from '@modern-js/runtime/router';
import { Provider } from '@modern-js/runtime/model';
import { PrimeReactProvider } from 'primereact/api';

import AuthProvider from '../hooks/auth';
import Header from '@/components/header';

import './reset.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

export default function Layout() {
  return (
    <Provider config={{}}>
      <AuthProvider>
        <div className="layout-root">
          <PrimeReactProvider>
            <Header />
            <Outlet />
          </PrimeReactProvider>
        </div>
      </AuthProvider>
    </Provider>
  );
}
