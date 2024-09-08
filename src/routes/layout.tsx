import './reset.scss';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

import { Outlet } from '@modern-js/runtime/router';
import { Provider } from '@modern-js/runtime/model';
import { PrimeReactProvider } from 'primereact/api';

import AuthProvider from '@/hooks/auth';
import PersistState from '@/hooks/persistState';
import Header from '@/components/header';

export default function Layout() {
  return (
    <Provider config={{}}>
      <AuthProvider>
        <PersistState>
          {/* <div className="layout-root"> */}
          <PrimeReactProvider>
            <Header />
            <Outlet />
          </PrimeReactProvider>
          {/* </div> */}
        </PersistState>
      </AuthProvider>
    </Provider>
  );
}
