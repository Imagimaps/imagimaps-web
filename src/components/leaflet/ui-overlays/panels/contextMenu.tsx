import L, { LatLng, Point } from 'leaflet';
import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import CircleQuestionSvg from '@shared/svg/circle-question.svg';
import LocationOnMapSvg from '@shared/svg/location-on-map.svg';
import PolygonAreaSvg from '@shared/svg/polygon-area.svg';
import PathSvg from '@shared/svg/path-between-points.svg';
import AddSvg from '@shared/svg/add.svg';
import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import { MapRuntimeModel } from '../../mapRuntimeModel';
import SvgIcon from '@/components/icon/svg';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContextMenuProps {}

const ContextMenu: FC<ContextMenuProps> = () => {
  const [stagedMarker, runtimeActions] = useModel(
    MapRuntimeModel,
    model => model.selectedMarker,
  );

  const menuBarRef = useRef<any>(null);
  const [position, setPosition] = useState<LatLng | undefined>();

  useEffect(() => {
    if (menuBarRef.current) {
      L.DomEvent.disableClickPropagation(menuBarRef.current);
      L.DomEvent.disableScrollPropagation(menuBarRef.current);
    }
  });

  const map = useMapEvents({
    click(e) {
      // Check to see if context menu is already open and if so, close it
      if (position) {
        setPosition(undefined);
        return;
      }
      // Check to see if we have a new marker being created and if so, close it
      if (stagedMarker) {
        setPosition(undefined);
        console.log(
          'Context Menu: on map click staged',
          position,
          stagedMarker,
        );
        return;
      }
      console.log('on map click empty position');
      runtimeActions.clearAllEdits();
      // TODO: Wait half a second to see if we get a double click
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    keypress(_e) {
      // console.log('keypress', e);
      // if (e.originalEvent.key === 's') {
      //   menuBarRef.current.openPopup();
      // }
    },
    keydown(e) {
      // console.log('keydown', e);
      if (e.originalEvent.key === 'Escape') {
        setPosition(undefined);
      }
    },
  });

  const markerIcon = L.icon({
    iconUrl: CircleQuestionSvg,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const addNewPointMarker: MouseEventHandler = event => {
    if (!position) {
      return;
    }
    event.stopPropagation();
    runtimeActions.createMarkerAt({ x: position.lng, y: position.lat });
    setPosition(undefined);
  };

  return position ? (
    <Marker
      icon={markerIcon}
      position={position}
      riseOnHover={true}
      autoPan={true}
      eventHandlers={{
        add(e) {
          e.sourceTarget.openPopup();
        },
      }}
    >
      <ContextMenuBar
        ref={menuBarRef}
        offset={new Point(0, -16)}
        autoPan={true}
        keepInView={true}
        closeButton={false}
        closeOnEscapeKey={true}
        eventHandlers={{
          remove() {
            setPosition(undefined);
          },
        }}
      >
        <MetaIcon src={AddSvg} alt="Add" />
        <ActiveButton
          src={LocationOnMapSvg}
          alt="Location on Map"
          onClick={addNewPointMarker}
        />
        <DisabledButton src={PolygonAreaSvg} alt="Area on Map" />
        <DisabledButton src={PathSvg} alt="Path on Map" />
      </ContextMenuBar>
    </Marker>
  ) : null;
};

export default ContextMenu;

const MetaIcon = styled(SvgIcon)`
  width: 1.5rem;
  height: 1.5rem;
`;

const ActiveButton = styled(SvgIcon)`
  cursor: 'pointer';
  padding: 2px;
  border-radius: 2px;
  width: 2rem;
  height: 2rem;

  &:hover {
    box-shadow: inset 0 0 2px #000000;
  }
`;

const DisabledButton = styled(SvgIcon)`
  cursor: 'not-allowed';
  padding: 2px;
  border-radius: 2px;
  opacity: 0.5;
  width: 2rem;
  height: 2rem;

  &:hover {
    box-shadow: inset 0 0 2px grey;
    opacity: 0.3;
  }
`;

const ContextMenuBar = styled(Popup as any)`
  border-radius: 2px;

  .leaflet-popup-content {
    margin: 5px 10px;
    display: flex;
    gap: 5px;
    align-items: center;
  }
`;
