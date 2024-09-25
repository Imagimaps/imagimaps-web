import { FC, useEffect, useRef, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import CloseSvg from '@shared/svg/close-circle.svg';
import { MapMarker } from '@shared/_types';
import { xy } from '../../_coordTranslators';
import { StagedDataModel } from '../../state/stagedData';
import MarkerDetails from './marker-details';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const SideContentsPanel: FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelActive, setPanelActive] = useState(false);
  const [model, action] = useModel(StagedDataModel);

  const map = useMapEvents({
    click(_e) {
      // Look into auto save changes on click away
      console.log('[Side Contents Panel] Deselect marker');
      if (panelActive) {
        action.resetStagedMarker();
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
      setPanelActive(true);
      const { position } = marker;
      map.flyTo(xy(position.x, position.y), map.getZoom());
    } else {
      setPanelActive(false);
    }
  };

  useEffect(() => {
    console.log('[Side Contents Panel] Load staged marker', model.mapMarker);
    loadMarker(model.mapMarker as MapMarker);
  }, [model.mapMarker]);

  console.log('[Side Contents Panel] Render', panelActive);

  return (
    panelActive && (
      <div ref={panelRef} className="side-contents-panel">
        <div className="side-contents-panel-close-wrapper">
          <SvgIcon
            src={CloseSvg}
            alt="Close Details Panel"
            onClick={() => {
              action.resetStagedMarker();
              setPanelActive(false);
            }}
          />
        </div>
        <MarkerDetails />
      </div>
    )
  );
};

export default SideContentsPanel;
