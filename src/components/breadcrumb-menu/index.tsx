import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { PrimeIcons } from 'primereact/api';

import { AppModel } from '@/state/appModel';
import { LayerModel } from '@/routes/world/[worldId]/[mapId]/_state/layers';

import './index.scss';

const BreadcrumbMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [{ community, activeWorld, activeMap }] = useModel(AppModel);
  const [layers] = useModel(LayerModel);
  const [crumbs, setCrumbs] = useState<MenuItem[]>([]);

  const currentRoute = location.pathname;

  const buildPortalCrumbs = () => {
    const biscuit: MenuItem[] = [];
    return biscuit;
  };

  const buildWorldCrumbs = (routeParts: string[]) => {
    const biscuit: MenuItem[] = [];
    const worldId = routeParts[1];
    const mapId = routeParts[2];
    console.log(
      `[Breadcrumb] Building Breadcrumbs with World ID: ${worldId}, Map ID: ${mapId}`,
    );
    console.log('[Breadcrumb] Active World:', activeWorld);
    console.log('[Breadcrumb] Active Map:', activeMap);
    biscuit.push({
      label: 'Portal',
      command: (e: any) => {
        e.originalEvent.preventDefault();
        navigate('/portal');
      },
    });
    if (worldId && activeWorld) {
      biscuit.push({
        label: `World: ${activeWorld.name}`,
        icon: PrimeIcons.GLOBE,
        command: (e: any) => {
          e.originalEvent.preventDefault();
          navigate(`/world/${worldId}`);
        },
      });
      if (mapId && activeMap) {
        biscuit.push({
          label: `Map: ${activeMap.intrinsics.name}`,
          icon: PrimeIcons.MAP,
          command: (e: any) => {
            e.originalEvent.preventDefault();
            navigate(`/world/${worldId}/${mapId}`);
          },
        });
      }
    }
    return biscuit;
  };

  useEffect(() => {
    const biscuit: MenuItem[] = [];
    console.log('[Breadcrumb] Current route', currentRoute);
    const routeParts = currentRoute.split('/').splice(1);
    if (routeParts.length === 0) {
      return;
    }
    console.log('[Breadcrumb] Route parts', routeParts);
    const routeRoot = routeParts[0];
    switch (routeRoot) {
      case 'portal':
        console.log('[Breadcrumb] Portal route detected');
        biscuit.push(...buildPortalCrumbs());
        break;
      case 'world':
        console.log('[Breadcrumb] World route detected');
        biscuit.push(...buildWorldCrumbs(routeParts));
        break;
      case 'community':
        console.log('[Breadcrumb] Community route detected');
        break;
      default:
        console.log('[Breadcrumb] Non-tracked route detected');
        break;
    }
    setCrumbs(biscuit);
  }, [currentRoute, community, activeWorld, activeMap, layers]);

  if (currentRoute === '/') {
    return undefined;
  }

  return (
    <div className="breadcrumb-menu">
      <BreadCrumb
        home={{
          icon: PrimeIcons.HOME,
          command: (e: any) => {
            e.originalEvent.preventDefault();
            navigate('/');
          },
        }}
        model={crumbs}
      />
    </div>
  );
};

export default BreadcrumbMenu;
