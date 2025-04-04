import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';

import { UIPanelDataModel } from '../state/uiPanels';
import { StagedPointMarkerModel } from '../state/stagedPointMarker';
import SideContentsPanel from './side-contents-panel';
import ContextMenu from './context-menu';
import OverlayFilter from './overlay-filter';
import EngineSettings from './engine-settings';
import ControlBar from './control-bar';
import StringFilter from './string-filter';

import './index.scss';

const ControlPanelLayout: FC = () => {
  const [uiModel, uiActions] = useModel(UIPanelDataModel);
  const [, stagedPointMarkerActions] = useModel(StagedPointMarkerModel);

  const map = useMapEvents({
    click(e) {
      if (uiModel.showCtxMenu) {
        uiActions.closeCtxMenu();
        return;
      }
      if (uiModel.showDetailsPanel) {
        uiActions.closeDetailsPanel();
        stagedPointMarkerActions.resetStagedPointMarker();
        return;
      }
      console.log('on map click empty position');
      uiActions.setClickPosition(e.latlng);
      uiActions.openCtxMenu();
      map.flyTo(e.latlng, map.getZoom());
    },
    keydown(e) {
      if (e.originalEvent.key === 'Escape') {
        console.log('[UIControlPanels] Escape key pressed');
        uiActions.closeCtxMenu();
        uiActions.closeDetailsPanel();
        uiActions.clearClickPosition();
      }
    },
  });

  return (
    <div className="layout-overlay">
      <div className="panel-dock-top">
        <ControlBar>
          <StringFilter />
          <OverlayFilter />
          <EngineSettings />
        </ControlBar>
      </div>
      <SideContentsPanel />
      <ContextMenu />
    </div>
  );
};

export default ControlPanelLayout;
