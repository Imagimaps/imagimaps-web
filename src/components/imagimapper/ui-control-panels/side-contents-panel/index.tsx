import { FC, useEffect, useRef, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import CloseSvg from '@shared/svg/close-circle.svg';
import { MapMarker } from '@shared/_types';
import { EngineDataModel } from '../../state/engineData';
import { xy } from '../../_coordTranslators';
import MarkerDetails from './marker-details';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const SideContentsPanel: FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelActive, setPanelActive] = useState(false);
  const [
    {
      runtime: { selectedMarker, stagedMarker },
    },
    engineActions,
  ] = useModel(EngineDataModel);

  const map = useMapEvents({
    click(_e) {
      // Look into auto save changes on click away
      console.log('ContentsPanel deselect marker');
      engineActions.deselectMarker();
      if (panelActive) {
        engineActions.cancelCreatePointMarker();
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
    if (marker) {
      setPanelActive(true);
      const { position } = marker;
      map.flyTo(xy(position.x, position.y), map.getZoom());
    } else {
      setPanelActive(false);
    }
  };

  useEffect(() => {
    loadMarker(selectedMarker);
  }, [selectedMarker]);

  useEffect(() => {
    loadMarker(stagedMarker as MapMarker);
  }, [stagedMarker]);

  console.log('panelActive', panelActive);

  return (
    panelActive && (
      <div ref={panelRef} className="side-contents-panel">
        <div className="side-contents-panel-close-wrapper">
          <SvgIcon
            src={CloseSvg}
            alt="Close Details Panel"
            onClick={() => {
              engineActions.deselectMarker();
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
