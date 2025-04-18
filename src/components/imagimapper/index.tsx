import 'leaflet/dist/leaflet.css';
import L, { CRS, Point } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

import { FC, useEffect } from 'react';
import { MapContainer } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { xy } from './_coordTranslators';
import { EngineDataModel } from './state/engineData';
import ControlPanelLayout from './ui-control-panels';
import BackgroundTiledImages from './backgroundTiledImages';
import MarkerGroups from './markers/markerGroups';
import StagedMarker from './markers/stagedPointMarker';
import GhostTargetMarker from './markers/ghostTargetMarker';
import StagedPolygon from './markers/stagedPolygon';
import { StagedPointMarkerModel } from './state/stagedPointMarker';
import EverySecond from './triggers/everySecond';
import { TimerModel } from './state/timers';
import { useRemoteBackends } from '@/hooks/remoteBackends';
import { AuthModel } from '@/state/authModel';

import './index.scss';

const ImagiMapper: FC = () => {
  const { mapApiHost } = useRemoteBackends();
  const [{ user }] = useModel(AuthModel);
  const [{ map, userConfig }, actions] = useModel(EngineDataModel);
  const [{ stagedMarkerId }, { resetStagedPointMarker: resetStagedMarker }] =
    useModel(StagedPointMarkerModel, s => ({
      stagedMarkerId: s._id?.[2] ?? s._id?.[1],
    }));
  const [, timerActions] = useModel(TimerModel);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `ws://${mapApiHost}/api/map/${map.id}/ws`,
    {
      share: true,
      onError: e => {
        console.error('[Imagimapper] error', e);
      },
      shouldReconnect: closeEvent => {
        console.log('shouldReconnect', closeEvent);
        // TODO: Reconnect if the close event was not user initiated (wasClean === false)
        return true;
      },
      reconnectInterval: attemptNumber => {
        // TODO: Implement exponential backoff or something
        return 3000 + attemptNumber;
      },
      reconnectAttempts: 10,
      onReconnectStop: numAttempts => {
        console.log('[Imagimapper] onReconnectStop', numAttempts);
        // TODO: Set some kind of state to allow the user to reconnect manually
      },
      heartbeat: {
        message: 'ping',
        returnMessage: 'pong',
        interval: 10000,
        timeout: 20000,
      },
    },
  );

  useEffect(() => {
    console.log('readyState:', readyState);
    if (readyState === ReadyState.CONNECTING) {
      console.log('[Imagimapper] Connecting to websocket...');
    } else if (readyState === ReadyState.OPEN) {
      console.log('[Imagimapper] Websocket connected!');
      sendJsonMessage({ type: 'USER_CONNECTED', payload: user?.id });
    } else if (readyState === ReadyState.CLOSING) {
      console.log('[Imagimapper] Closing websocket...');
    } else if (readyState === ReadyState.CLOSED) {
      console.log('[Imagimapper] Websocket closed.');
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data);
      console.log('[Imagimapper] Received message:', message);
      const { type, payload } = message;
      if (type === 'MAP_DATA') {
        console.log('[Imagimapper] Received map data:', payload);
        actions.setMapData(payload);
        timerActions.initFromMapData(payload);
      } else if (type === 'LAYER_DATA_REFRESHED') {
        console.log('[Imagimapper] Received layer data refresh:', payload);
        // actions.setLayerData(payload);
        // } else if (type === 'MARKER_CREATION_SUCCESS') {
        //   const { marker } = payload;
        //   actions.setNewlyCreatedMarkerId(marker);
      } else if (type === 'MARKER_CREATED') {
        const { marker, overlayId } = payload;
        console.log(
          '[Imagimapper] Creating marker from WS Event:',
          marker,
          overlayId,
        );
        // actions.setNewlyCreatedMarkerId(marker);
        actions.createPointMarker(marker, overlayId);
      } else if (type === 'MARKER_UPDATED') {
        console.log('[Imagimapper] Updating marker from WS Event:', payload);
        actions.updateMarker(payload);
      } else if (type === 'MARKER_OVERLAY_UPDATED') {
        const { marker, overlayId } = payload;
        actions.moveMarkerToOverlay(marker, overlayId);
      } else if (type === 'MARKER_DELETED') {
        const markerId = payload as string;
        actions.deleteMarker(markerId);
        if (stagedMarkerId === markerId) {
          // TODO: Toast message to inform user that their staged marker was deleted bt someone else
          resetStagedMarker();
        }
      } else if (type === 'TIMER_CREATED') {
        timerActions.remoteTimerCreated(payload.markerId, payload.countdown);
      } else if (type === 'TIMER_UPDATED') {
        timerActions.remoteTimerUpdated(payload.markerId, payload.countdown);
      } else if (type === 'TIMER_DELETED') {
        const { timerId, markerId } = payload as {
          timerId: string;
          markerId: string;
        };
        timerActions.remoteTimerDeleted(markerId, timerId);
      } else if (type === 'USER_CONNECTED') {
        console.log('[Imagimapper] User connected:', payload);
      } else if (type === 'USER_DISCONNECTED') {
        console.log('[Imagimapper] User disconnected:', payload);
      } else {
        console.error('[Imagimapper] Unknown message type:', type, payload);
      }
    }
  }, [lastMessage]);

  const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: new Point(12, 41),
  });
  L.Marker.prototype.options.icon = DefaultIcon;

  // TODO: Look into L.Control.Scale
  return (
    <MapContainer
      className="leaflet-map-container"
      center={xy(userConfig.position.x, userConfig.position.y)}
      zoom={userConfig.zoom}
      zoomSnap={0.5}
      zoomDelta={0.5}
      minZoom={-1}
      maxZoom={2}
      bounceAtZoomLimits={true}
      scrollWheelZoom={true}
      crs={L.Util.extend({}, CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0),
      })}
      attributionControl={false}
    >
      <EverySecond />
      <ControlPanelLayout />
      <BackgroundTiledImages />
      <MarkerGroups />
      <StagedMarker />
      <StagedPolygon />
      <GhostTargetMarker />
    </MapContainer>
  );
};

export default ImagiMapper;
