// import './reset.scss';
import './layout.scss';
// import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import { Outlet } from '@modern-js/runtime/router';
import { Provider } from '@modern-js/runtime/model';
import { PrimeReactProvider } from 'primereact/api';

import AuthProvider from '@/hooks/auth';
import PersistState from '@/hooks/persistState';
import Header from '@/components/header';
import BreadcrumbMenu from '@/components/breadcrumb-menu';

export default function Layout() {
  return (
    <Provider config={{}}>
      <AuthProvider>
        <PersistState>
          <PrimeReactProvider>
            <Header />
            <BreadcrumbMenu />
            <div className="content">
              <Outlet />
            </div>
          </PrimeReactProvider>
        </PersistState>
      </AuthProvider>
    </Provider>
  );
}
