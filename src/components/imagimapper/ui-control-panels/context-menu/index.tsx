import { FC, MouseEventHandler, useEffect, useRef } from 'react';
import L, { Point } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';

import CircleQuestionSvg from '@shared/svg/circle-question.svg';
import LocationOnMapSvg from '@shared/svg/location-on-map.svg';
import PolygonAreaSvg from '@shared/svg/polygon-area.svg';
import PathSvg from '@shared/svg/path-between-points.svg';
import AddSvg from '@shared/svg/add.svg';
import { EngineDataModel } from '../../state/engineData';
import { UserInteractionsModel } from '../../state/userInteractions';
import { StagedPointMarkerModel } from '../../state/stagedPointMarker';
import { StagedPolygonModel } from '../../state/stagedPolygon';
import { UIPanelDataModel } from '../../state/uiPanels';
import SvgIcon from '@/components/icon/svg';

import './index.scss';

const ContextMenu: FC = () => {
  const [{ templates, lastUsedTemplate }, actions] = useModel(
    [
      EngineDataModel,
      StagedPointMarkerModel,
      StagedPolygonModel,
      UserInteractionsModel,
    ],
    (edm, spmm, _, uim) => ({
      templates: edm.templates,
      lastUsedTemplate: uim.lastUsedTemplate,
      isNew: spmm.isNew, // Needed?
      isChanged: spmm.isChanged, // Needed?
    }),
  );
  const [{ clickPosition: position, showCtxMenu }, uiActions] =
    useModel(UIPanelDataModel);

  const popupRef = useRef<any>(null);

  useEffect(() => {
    if (popupRef.current) {
      L.DomEvent.disableClickPropagation(popupRef.current);
      L.DomEvent.disableScrollPropagation(popupRef.current);
    }
  });

  const addNewPointMarker: MouseEventHandler = event => {
    console.log('[Context Menu] addNewPointMarker', position);
    if (!position) {
      return;
    }
    event.stopPropagation();
    const template = lastUsedTemplate ?? templates[0];
    console.log('[Context Menu] addNewPointMarker template', template);
    actions.createNewPointMarker(template, {
      x: position.lng,
      y: position.lat,
    });
    console.log(
      '[Context Menu] addNewPointMarker done. Clearing click position',
    );
    // uiActions.clearClickPosition();
    uiActions.closeCtxMenu();
    console.log('[Context Menu] Click position cleared');
  };

  const startNewPolygon: MouseEventHandler = event => {
    console.log('Context Menu: startNewPolygon', position);
    if (!position) {
      return;
    }
    event.stopPropagation();
    actions.startNewPolygon({ x: position.lng, y: position.lat });
  };

  return (
    showCtxMenu && (
      <Marker
        icon={L.icon({
          iconUrl: CircleQuestionSvg,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })}
        position={position!}
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
              uiActions.clearClickPosition();
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
            onClick={startNewPolygon}
          />
          <SvgIcon className="icon disabled" src={PathSvg} alt="Path on Map" />
        </Popup>
      </Marker>
    )
  );
};

export default ContextMenu;
