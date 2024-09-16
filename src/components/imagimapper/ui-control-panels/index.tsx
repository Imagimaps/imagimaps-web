import { FC } from 'react';

import SideContentsPanel from './side-contents-panel';
import ContextMenu from './context-menu';

import './index.scss';

const ControlPanelLayout: FC = () => {
  return (
    <div className="layout-overlay">
      <div className="panel-dock-top"></div>
      <SideContentsPanel />
      <ContextMenu />
    </div>
  );
};

export default ControlPanelLayout;
