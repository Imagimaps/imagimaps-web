import 'leaflet/dist/leaflet.css';
import L, { CRS } from 'leaflet';

import { FC, useEffect } from 'react';
import { MapContainer } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';

import { xy } from './_coordTranslators';
import { EngineDataModel } from './state/engineData';
import ControlPanelLayout from './ui-control-panels';
import BackgroundTiledImages from './backgroundTiledImages';
import MarkerGroups from './markers/markerGroups';

import './index.scss';
import StagedMarker from './markers/stagedMarker';
import GhostTargetMarker from './markers/ghostTargetMarker';

const ImagiMapper: FC = () => {
  const [{ userConfig }] = useModel(EngineDataModel);

  useEffect(() => {
    console.log('userConfig loaded:', userConfig);
  }, [userConfig]);

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
