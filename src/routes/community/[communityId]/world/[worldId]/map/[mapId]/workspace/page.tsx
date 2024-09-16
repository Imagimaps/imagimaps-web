import { useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useNavigate } from '@modern-js/runtime/router';

import GetMapDetails from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]';
// import { UserMapMetadata } from '@shared/_types';
// import MapView from '@/components/leaflet/mapView';
import { AppModel } from '@/state/appModel';
// import { MapDataModel } from '@/components/leaflet/mapDataModel';
import ImagiMapper from '@/components/imagimapper';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
// import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';

const MapWorkspacePage = () => {
  const navigate = useNavigate();
  const [{ community, activeWorld, activeMap, activeLayer }] =
    useModel(AppModel);
  const [, engineDataActions] = useModel(EngineDataModel);
  // const [, mapActions] = useModel(MapDataModel);
  // const [, runtimeActions] = useModel(MapRuntimeModel);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!community) {
      navigate(`/communities`);
    }
    if (!activeWorld) {
      navigate(`/communities/${community?.id}/worlds`);
    }
    if (!activeMap) {
      navigate(`/communities/${community?.id}/worlds/${activeWorld?.id}/maps`);
    }

    GetMapDetails(community!.id, activeWorld!.id, activeMap!.id, {
      query: { eagerLoad: true },
      data: undefined,
    }).then(res => {
      const { map, userMetadata } = res;
      console.log('Map on Page:', map);
      engineDataActions.initialise(
        map,
        { ...userMetadata, layerId: userMetadata.layerId ?? '' },
        map.layers.find(l => l.id === activeLayer?.id) ??
          activeLayer ??
          map.layers[0],
      );
      // appStateActions.updateMap(map);
      // mapActions.setMap(map);
      // const userConfig: UserMapMetadata = {
      //   ...userMetadata,
      //   layerId:
      //     userMetadata.layerId ?? activeLayer?.id ?? map.layers[0].id ?? '', // Does this not work for the type checker?!
      // };
      // console.log('userMetadata', userConfig);
      // mapActions.setUserConfig({
      //   ...userMetadata,
      //   layerId: userMetadata.layerId ?? '',
      // });
      // console.log('Do something with runtimeActions', runtimeActions);
      //   if (
      //     map.templateGroups.length > 0 &&
      //     map.templateGroups[0].templates.length > 0
      //   ) {
      //     runtimeActions.templateInteracted(map.templateGroups[0].templates[0]);
      //   }
      //   if (map.boundingTopography.overlays.length > 0) {
      //     runtimeActions.overlayInteracted(map.boundingTopography.overlays[0]);
      //   }
      setReady(true);
    });
  }, []);

  return <>{ready ? <ImagiMapper /> : <div>Loading</div>}</>;
};

export default MapWorkspacePage;
