import { FC, useEffect, useRef, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import CloseSvg from '@shared/svg/close-circle.svg';
import L from 'leaflet';
import { useMapEvents } from 'react-leaflet';
import { MapMarker } from '@shared/_types';
import { MapRuntimeModel } from '../../mapRuntimeModel';
import { xy } from '../../mapView';
// import MarkerDetails from './detailsPanel/markerDetails';
import MarkerDetailsV2 from './markerDetails/index';
import SvgIcon from '@/components/icon/svg';

const ContentsPanel: FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelActive, setPanelActive] = useState(false);
  const [runtime, runtimeActions] = useModel(MapRuntimeModel);

  const { selectedMarker, stagedMarker } = runtime;

  const map = useMapEvents({
    click(_e) {
      // Look into auto save changes on click away
      console.log('ContentsPanel deselect marker');
      runtimeActions.markerDeselected();
      if (panelActive) {
        runtimeActions.cancelCreatePointMarker();
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

  const closeDetailsPanel = () => {
    runtimeActions.setSelectedMarker(undefined);
    setPanelActive(false);
  };

  return panelActive ? (
    <ContentPanelBox as="div" ref={panelRef}>
      <CloseIconButton
        src={CloseSvg}
        alt="Close Details Panel"
        onClick={closeDetailsPanel}
      />
      <ContentArea>
        {/* <MarkerDetails /> */}
        <MarkerDetailsV2 />
      </ContentArea>
    </ContentPanelBox>
  ) : null;
};

export default ContentsPanel;

// Look at this cool "Old Map" effect later: https://stackoverflow.com/a/63615485
const ContentPanelBox = styled.div`
  pointer-events: all;
  cursor: default;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 400px;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
`;

const CloseIconButton = styled(SvgIcon)`
  position: absolute;
  right: 0;
  top: 0;
  margin: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  background: white;
`;

const ContentArea = styled.div``;
