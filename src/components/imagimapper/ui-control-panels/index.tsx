import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';

import { UIPanelDataModel } from '../state/uiPanels';
import SideContentsPanel from './side-contents-panel';
import ContextMenu from './context-menu';

import './index.scss';

const ControlPanelLayout: FC = () => {
  const [uiModel, uiActions] = useModel(UIPanelDataModel);

  useMapEvents({
    click(_e) {
      if (uiModel.showCtxMenu) {
        uiActions.toggleCtxMenu();
      }
    },
  });

  return (
    <div className="layout-overlay">
      <div className="panel-dock-top"></div>
      <SideContentsPanel />
      <ContextMenu />
    </div>
  );
};

export default ControlPanelLayout;
