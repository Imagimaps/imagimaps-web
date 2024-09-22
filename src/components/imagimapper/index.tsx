import 'leaflet/dist/leaflet.css';
import L, { CRS } from 'leaflet';

import { FC, useEffect } from 'react';
import { MapContainer } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { xy } from './_coordTranslators';
import { EngineDataModel } from './state/engineData';
import ControlPanelLayout from './ui-control-panels';
import BackgroundTiledImages from './backgroundTiledImages';
import MarkerGroups from './markers/markerGroups';
import StagedMarker from './markers/stagedMarker';
import GhostTargetMarker from './markers/ghostTargetMarker';
import { AuthModel } from '@/state/authModel';

import './index.scss';

const ImagiMapper: FC = () => {
  const [{ user }] = useModel(AuthModel);
  const [{ map, userConfig }, actions] = useModel(EngineDataModel);

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    `ws://localhost:8082/api/map/${map.id}/ws`,
    {
      share: true,
      onError: e => {
        console.error('error', e);
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
        console.log('onReconnectStop', numAttempts);
        // TODO: Set some kind of state to allow the user to reconnect manually
      },
      // heartbeat: {
      //   message: 'ping',
      //   returnMessage: 'pong',
      //   interval: 10000,
      //   timeout: 20000,
      // },
    },
  );

  useEffect(() => {
    console.log('readyState:', readyState);
    if (readyState === ReadyState.CONNECTING) {
      console.log('Connecting to websocket...');
    } else if (readyState === ReadyState.OPEN) {
      console.log('Websocket connected!');
      sendJsonMessage(JSON.stringify({ type: 'USER_ACTIVE', user: user?.id }));
    } else if (readyState === ReadyState.CLOSING) {
      console.log('Closing websocket...');
    } else if (readyState === ReadyState.CLOSED) {
      console.log('Websocket closed.');
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data);
      console.log('Received message:', message);
      const { type, payload } = message;
      if (type === 'MARKER_CREATED') {
        const { marker, overlayId } = payload;
        actions.createPointMarker(marker, overlayId);
      } else if (type === 'MARKER_UPDATED') {
        console.log('Updating marker from WS Event:', payload);
        actions.updateMarker(payload);
      } else if (type === 'MARKER_OVERLAY_UPDATED') {
        const { marker, overlayId } = payload;
        actions.moveMarkerToOverlay(marker, overlayId);
      } else if (type === 'MARKER_DELETED') {
        const { markerId } = payload;
        actions.deleteMarker(markerId);
      } else {
        console.error('Unknown message type:', type, payload);
      }
    }
  }, [lastMessage]);

  // TODO: Look into L.Control.Scale
  return (
    <MapContainer
      className="leaflet-map-container"
      center={xy(userConfig.position.x, userConfig.position.y)}
      zoom={userConfig.zoom}
      zoomSnap={0.5}
      zoomDelta={0.5}
      minZoom={0}
      maxZoom={2}
      bounceAtZoomLimits={true}
      scrollWheelZoom={true}
      crs={L.Util.extend({}, CRS.Simple, {
        transformation: new L.Transformation(1, 0, 1, 0),
      })}
    >
      <ControlPanelLayout />
      <BackgroundTiledImages />
      <MarkerGroups />
      <StagedMarker />
      <GhostTargetMarker />
    </MapContainer>
  );
};

export default ImagiMapper;
