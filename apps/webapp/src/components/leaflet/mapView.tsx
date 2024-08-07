import { FC, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer } from 'react-leaflet';
import L, { CRS, Point, latLng } from 'leaflet';
import GET, { FetchMapResponse } from '@api/map/[world_id]/[map_id]';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import BackgroundLayer from './backgroundLayer';
import { MapDataModel } from './mapDataModel';
import PanelLayouts from './ui-overlays/panelLayouts';
import MarkerGroups from './markerGroups';
import { MapRuntimeModel } from './mapRuntimeModel';
import StagedMarker from './stagedMarker';
import GhostTargetMarker from './ghostTargetMarker';

const DefaultIcon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: new Point(12, 41),
});
L.Marker.prototype.options.icon = DefaultIcon;

export const yx = L.latLng;

export const xy = (x: number, y: number) => {
  if (Array.isArray(x)) {
    // When doing xy([x, y]);
    return yx(x[1], x[0]);
  }
  return yx(y, x); // When doing xy(x, y);
};

interface MapViewProps {
  worldId: string;
  mapId: string;
}

const MapView: FC<MapViewProps> = ({ worldId, mapId }) => {
  const [, mapActions] = useModel(MapDataModel);
  const [, runtimeActions] = useModel(MapRuntimeModel);
  const [ready, setReady] = useState(false);
  const [pos, setPos] = useState(latLng([500, 500]));

  useEffect(() => {
    GET(worldId, mapId).then((res: FetchMapResponse) => {
      console.log('Map data: ', res);
      const { map, defaults, user } = res;
      mapActions.setMap(map);
      mapActions.setDefaultConfig(defaults);
      mapActions.setUserConfig(user);

      if (
        map.templateGroups.length > 0 &&
        map.templateGroups[0].templates.length > 0
      ) {
        runtimeActions.templateInteracted(map.templateGroups[0].templates[0]);
      }
      if (map.topology.overlays.length > 0) {
        runtimeActions.overlayInteracted(map.topology.overlays[0]);
      }

      const viewPos = xy(
        user?.viewPosition?.x ?? defaults.viewPosition.x,
        user?.viewPosition?.y ?? defaults.viewPosition.y,
      );
      setPos(viewPos);
      setReady(true);
    });
  }, []);

  const CustomCRS = L.Util.extend({}, CRS.Simple, {
    transformation: new L.Transformation(1, 0, 1, 0),
  });

  return ready ? (
    <ViewPane>
      <MapContainer
        center={pos}
        zoom={2}
        minZoom={0}
        maxZoom={4}
        bounceAtZoomLimits={true}
        scrollWheelZoom={true}
        style={{ height: '100%' }}
        crs={CustomCRS}
      >
        <PanelLayouts />
        <BackgroundLayer />
        <MarkerGroups />
        <StagedMarker />
        <GhostTargetMarker />
      </MapContainer>
    </ViewPane>
  ) : (
    <div>Loading...</div>
  );
};

export default MapView;

const ViewPane = styled.div`
  height: 100%;
`;
