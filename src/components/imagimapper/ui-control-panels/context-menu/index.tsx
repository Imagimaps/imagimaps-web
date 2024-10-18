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
import { UserInteractionsModel } from '../../state/userInteractions';
import { StagedDataModel } from '../../state/stagedData';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const ContextMenu: FC = () => {
  // TODO: Create a model for UI Component State (such as side panel open/closed, etc...)
  const [{ templates, lastUsedTemplate, isNew, isChanged }, actions] = useModel(
    [EngineDataModel, StagedDataModel, UserInteractionsModel],
    (e, s, u) => ({
      templates: e.templates,
      lastUsedTemplate: u.lastUsedTemplate,
      isNew: s.isNew,
      isChanged: s.isChanged,
    }),
  );

  const popupRef = useRef<any>(null);
  const [position, setPosition] = useState<LatLng | undefined>();
  const [showCtxMenu, setShowCtxMenu] = useState<boolean>(false);

  useEffect(() => {
    if (popupRef.current) {
      L.DomEvent.disableClickPropagation(popupRef.current);
      L.DomEvent.disableScrollPropagation(popupRef.current);
    }
  });

  useEffect(() => {
    if (position) {
      setShowCtxMenu(true);
    } else {
      setShowCtxMenu(false);
    }
  }, [position]);

  const map = useMapEvents({
    click(e) {
      // Check to see if context menu is already open and if so, close it
      if (position) {
        setPosition(undefined);
        return;
      }
      // Check to see if we have a new marker being created and if so, close it
      if (isNew || isChanged) {
        // TODO: Popup to confirm abandoning edits
        setPosition(undefined);
        console.log('Context Menu: on map click staged', position);
        actions.resetStagedMarker();
        return;
      }
      console.log('on map click empty position');
      actions.resetStagedMarker();
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
    console.log('Context Menu: addNewPointMarker', position);
    if (!position) {
      return;
    }
    event.stopPropagation();
    const template = lastUsedTemplate ?? templates[0];
    actions.createNewMarker(template, { x: position.lng, y: position.lat });
    // actions.stageNewMarkerAt({ x: position.lng, y: position.lat });
    setPosition(undefined);
  };

  const startNewPolygon: MouseEventHandler = event => {
    console.log('Context Menu: startNewPolygon', position);
    if (!position) {
      return;
    }
    event.stopPropagation();
    // actions.stageNewPolygonAt({ x: position.lng, y: position.lat });
    setPosition(undefined);
  };

  return (
    showCtxMenu &&
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
            className="icon"
            src={PolygonAreaSvg}
            alt="Area on Map"
            onClick={startNewPolygon}
          />
          <SvgIcon className="icon disabled" src={PathSvg} alt="Path on Map" />
        </Popup>
      </Marker>
    )
  );
};

export default ContextMenu;
