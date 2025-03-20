import { useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import GetUserMap from '@api/bff/user/map/[mapId]';
import { useLocation, useParams } from '@modern-js/runtime/router';
import { LayerModel } from '../_state/layers';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';
import { AppModel } from '@/state/appModel';
import ImagiMapper from '@/components/imagimapper';

const WorkspacePage: React.FC = () => {
  const [{ activeMap }] = useModel(AppModel);
  const [{ activeLayer }] = useModel(LayerModel);
  const [, engineDataActions] = useModel(EngineDataModel);
  const [, userInteractions] = useModel(UserInteractionsModel);
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const { mapId } = useParams<{ mapId: string }>();

  useEffect(() => {
    const searchQuery = location.search.substring(1);
    const layerId = searchQuery
      .split('&')
      .find(s => s.includes('layer='))
      ?.split('=')[1];
    console.log('[Workspace] loading layerId:', layerId);
    if (!activeMap) {
      if (!mapId) {
        console.error('No mapId detected in URL');
        return;
      }
      console.log('Getting Map Details for Map:', mapId);
      GetUserMap(mapId).then(res => {
        const { map, userMetadata } = res;
        console.log('[Workspace] Active Map:', map, userMetadata);
        engineDataActions.initialise(
          map,
          { ...userMetadata, layerId: layerId ?? userMetadata.layerId ?? '' },
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
    } else {
      const { userMetadata } = location.state;
      console.log('[Workspace] Active Map:', activeMap);
      engineDataActions.initialise(
        activeMap,
        { ...userMetadata, layerId: layerId ?? userMetadata.layerId ?? '' },
        activeMap.layers.find(l => l.id === activeLayer?.id) ??
          activeLayer ??
          activeMap.layers[0],
      );
      const overlays = activeMap.layers.flatMap(l => l.overlays ?? []);
      const templates = (activeMap.templateGroups ?? []).flatMap(
        t => t.markerTemplates,
      );
      userInteractions.overlayUsed(overlays[0]);
      userInteractions.templateUsed(templates[0]);
      setReady(true);
    }
  }, [activeMap]);

  return <>{ready ? <ImagiMapper /> : <div>Loading</div>}</>;
};

export default WorkspacePage;
