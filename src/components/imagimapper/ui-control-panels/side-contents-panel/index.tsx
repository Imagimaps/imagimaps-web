import { FC, useEffect, useRef, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import CloseSvg from '@shared/svg/close-circle.svg';
import { MapMarker } from '@shared/_types';
import { xy } from '../../_coordTranslators';
import { StagedPointMarkerModel } from '../../state/stagedPointMarker';
import { UIPanelDataModel } from '../../state/uiPanels';
import MarkerDetails from './marker-details';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const SideContentsPanel: FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [saveOnClose] = useState(false);
  const [model, action] = useModel(StagedPointMarkerModel);
  const [{ showDetailsPanel }, uiActions] = useModel(UIPanelDataModel);

  const map = useMapEvents({
    click(_e) {
      if (saveOnClose) {
        console.log('[Side Contents Panel] TODO: Save marker on close');
      }
      console.log('[Side Contents Panel] Deselect marker');
      if (showDetailsPanel) {
        action.resetStagedPointMarker();
        uiActions.closeDetailsPanel();
      }
    },
  });

  useEffect(() => {
    if (panelRef.current) {
      L.DomEvent.disableClickPropagation(panelRef.current);
      L.DomEvent.disableScrollPropagation(panelRef.current);
    }
  });

  const loadMarker = (marker?: MapMarker) => {
    console.log('[Side Contents Panel] loadMarker', marker);
    if (marker) {
      uiActions.openDetailsPanel();
      const { position } = marker;
      map.flyTo(xy(position.x, position.y), map.getZoom());
    } else {
      uiActions.closeDetailsPanel();
    }
  };

  useEffect(() => {
    console.log('[Side Contents Panel] Load staged marker', model.mapMarker);
    loadMarker(model.mapMarker as MapMarker);
  }, [model.mapMarker]);

  console.log('[Side Contents Panel] Render', showDetailsPanel);

  return (
    showDetailsPanel && (
      <div ref={panelRef} className="side-contents-panel">
        <div className="side-contents-panel-close-wrapper">
          <SvgIcon
            src={CloseSvg}
            alt="Close Details Panel"
            onClick={() => {
              action.resetStagedPointMarker();
              uiActions.closeDetailsPanel();
            }}
          />
        </div>
        <MarkerDetails />
      </div>
    )
  );
};

export default SideContentsPanel;
