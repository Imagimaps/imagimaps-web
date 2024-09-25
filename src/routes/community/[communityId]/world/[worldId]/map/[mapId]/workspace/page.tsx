import { useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useNavigate } from '@modern-js/runtime/router';

import GetMapDetails from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]';
import { AppModel } from '@/state/appModel';
import ImagiMapper from '@/components/imagimapper';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';

const MapWorkspacePage = () => {
  const navigate = useNavigate();
  const [{ community, activeWorld, activeMap, activeLayer }] =
    useModel(AppModel);
  const [, engineDataActions] = useModel(EngineDataModel);
  const [, userInteractions] = useModel(UserInteractionsModel);
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
      const overlays = map.layers.flatMap(l => l.overlays ?? []);
      const templates = (map.templateGroups ?? []).flatMap(
        t => t.markerTemplates,
      );
      userInteractions.overlayUsed(overlays[0]);
      userInteractions.templateUsed(templates[0]);
      setReady(true);
    });
  }, []);

  return <>{ready ? <ImagiMapper /> : <div>Loading</div>}</>;
};

export default MapWorkspacePage;
