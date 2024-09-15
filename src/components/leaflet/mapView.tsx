import { FC, useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
// import { useNavigate } from '@modern-js/runtime/router';
import { MapContainer } from 'react-leaflet';
import L, { CRS, Point, latLng } from 'leaflet';

// import GetMapDetails from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import BackgroundLayer from './backgroundLayer';
import { MapDataModel } from './mapDataModel';
import PanelLayouts from './ui-overlays/panelLayouts';
import MarkerGroups from './markerGroups';
// import { MapRuntimeModel } from './mapRuntimeModel';
import StagedMarker from './stagedMarker';
import GhostTargetMarker from './ghostTargetMarker';
// import { AppModel } from '@/state/appModel';

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
  selectedLayerId?: string;
}

const MapView: FC<MapViewProps> = () => {
  // const [{ activeWorld, activeMap, community }, appStateActions] =
  //   useModel(AppModel);
  const [{ userConfig }] = useModel(MapDataModel);
  const [pos, setPos] = useState(latLng([500, 500]));

  useEffect(() => {
    if (userConfig?.position) {
      setPos(xy(userConfig.position.x, userConfig.position.y));
    }
  }, [userConfig]);

  // useEffect(() => {
  //   if (!community) {
  //     navigate(`/communities`);
  //   }
  //   if (!activeWorld) {
  //     navigate(`/communities/${community?.id}/worlds`);
  //   }
  //   if (!activeMap) {
  //     navigate(`/communities/${community?.id}/worlds/${activeWorld?.id}/maps`);
  //   }

  //   // mapActions.setMap(activeMap!);

  //   GetMapDetails(community!.id, activeWorld!.id, activeMap!.id, {
  //     query: { eagerLoad: true },
  //     data: undefined,
  //   }).then(res => {
  //     const { map, userMetadata } = res;
  //     console.log('Map:', map);
  //     appStateActions.updateMap(map);
  //     mapActions.setMap(map);
  //     mapActions.setUserConfig({
  //       viewPosition: {
  //         x: userMetadata.position.x,
  //         y: userMetadata.position.y,
  //       },
  //       viewZoom: userMetadata.zoom,
  //       activeLayer: map.layers.find(l => l.id === selectedLayerId),
  //     });
  //     console.log('Do something with runtimeActions', runtimeActions);
  //     //   if (
  //     //     map.templateGroups.length > 0 &&
  //     //     map.templateGroups[0].templates.length > 0
  //     //   ) {
  //     //     runtimeActions.templateInteracted(map.templateGroups[0].templates[0]);
  //     //   }
  //     //   if (map.boundingTopography.overlays.length > 0) {
  //     //     runtimeActions.overlayInteracted(map.boundingTopography.overlays[0]);
  //     //   }
  //     setPos(xy(userMetadata.position.x, userMetadata.position.y));
  //     setReady(true);
  //   });
  // }, []);

  const CustomCRS = L.Util.extend({}, CRS.Simple, {
    transformation: new L.Transformation(1, 0, 1, 0),
  });

  return (
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
  );
};

export default MapView;

const ViewPane = styled.div`
  height: 100%;
`;
