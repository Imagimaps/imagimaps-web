import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { BreadCrumb } from 'primereact/breadcrumb';
import { MenuItem } from 'primereact/menuitem';
import { PrimeIcons } from 'primereact/api';

import { CommunityModel } from '@/state/communityModel';

import './index.scss';

const BreadcrumbMenu: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [{ community, activeWorld, activeMap }] = useModel(CommunityModel);
  const [crumbs, setCrumbs] = useState<MenuItem[]>([]);

  const currentRoute = location.pathname;
  console.log('Current route', currentRoute);

  useEffect(() => {
    const biscuit: MenuItem[] = [];
    if (community) {
      biscuit.push({
        label: `Community: ${community.name}`,
        command: (e: any) => {
          e.originalEvent.preventDefault();
          navigate(`/community/${community.id}`);
        },
      });
      if (activeWorld) {
        biscuit.push({
          label: `World: ${activeWorld.name}`,
          command: (e: any) => {
            e.originalEvent.preventDefault();
            navigate(`/community/${community.id}/world/${activeWorld.id}`);
          },
        });
        if (activeMap) {
          biscuit.push({
            label: `Map: ${activeMap.name}`,
            command: (e: any) => {
              e.originalEvent.preventDefault();
              navigate(
                `/community/${community.id}/world/${activeWorld.id}/map/${activeMap.id}`,
              );
            },
          });
        }
      }
    }
    setCrumbs(biscuit);
  }, [community, activeWorld, activeMap]);

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
