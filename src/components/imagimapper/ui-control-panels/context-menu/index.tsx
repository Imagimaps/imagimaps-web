import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import L, { LatLng, Point } from 'leaflet';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';

import CircleQuestionSvg from '@shared/svg/circle-question.svg';
import LocationOnMapSvg from '@shared/svg/location-on-map.svg';
import PolygonAreaSvg from '@shared/svg/polygon-area.svg';
import PathSvg from '@shared/svg/path-between-points.svg';
import AddSvg from '@shared/svg/add.svg';
import { EngineDataModel } from '../../state/engineData';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const ContextMenu: FC = () => {
  const [stagedMarker, actions] = useModel(
    EngineDataModel,
    model => model.runtime.selectedMarker,
  );

  const popupRef = useRef<any>(null);
  const [position, setPosition] = useState<LatLng | undefined>();

  useEffect(() => {
    if (popupRef.current) {
      L.DomEvent.disableClickPropagation(popupRef.current);
      L.DomEvent.disableScrollPropagation(popupRef.current);
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
      actions.abandonAllEdits();
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

  const addNewPointMarker: MouseEventHandler = event => {
    if (!position) {
      return;
    }
    event.stopPropagation();
    actions.stageNewMarkerAt({ x: position.lng, y: position.lat });
    setPosition(undefined);
  };

  return (
    position && (
      <Marker
        icon={L.icon({
          iconUrl: CircleQuestionSvg,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })}
        position={position}
        riseOnHover={true}
        autoPan={true}
        eventHandlers={{
          add(e) {
            e.sourceTarget.openPopup();
          },
        }}
      >
        <Popup
          ref={popupRef}
          className="context-menu-popup"
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
          <SvgIcon className="meta-icon" src={AddSvg} alt="Add" />
          <SvgIcon
            className="icon"
            src={LocationOnMapSvg}
            alt="Location on Map"
            onClick={addNewPointMarker}
          />
          <SvgIcon
            className="icon disabled"
            src={PolygonAreaSvg}
            alt="Area on Map"
          />
          <SvgIcon className="icon disabled" src={PathSvg} alt="Path on Map" />
        </Popup>
      </Marker>
    )
  );
};

export default ContextMenu;
