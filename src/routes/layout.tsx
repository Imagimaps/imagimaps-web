// import './reset.scss';
import '../global.scss';
import './layout.scss';
// import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import { Outlet } from '@modern-js/runtime/router';
import { Provider } from '@modern-js/runtime/model';
import { PrimeReactProvider } from 'primereact/api';

import AuthenticationProvider from '@/hooks/authentication';
import PersistState from '@/hooks/persistState';
import RemoteBackends from '@/hooks/remoteBackends';
import Header from '@/components/header';
import BreadcrumbMenu from '@/components/breadcrumb-menu';

export default function Layout() {
  return (
    <Provider config={{}}>
      <RemoteBackends>
        <AuthenticationProvider>
          <PersistState>
            <PrimeReactProvider>
              <Header />
              <BreadcrumbMenu />
              <div className="content">
                <Outlet />
              </div>
            </PrimeReactProvider>
          </PersistState>
        </AuthenticationProvider>
      </RemoteBackends>
    </Provider>
  );
}
