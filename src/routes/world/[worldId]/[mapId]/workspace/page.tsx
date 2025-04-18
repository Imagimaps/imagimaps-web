import { useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import GetUserMap from '@api/bff/user/map/[mapId]';
import { useLocation, useNavigate, useParams } from '@modern-js/runtime/router';
import { UserMapMetadata } from '@shared/_types';
import { LayerModel } from '../_state/layers';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';
import { AppModel } from '@/state/appModel';
import ImagiMapper from '@/components/imagimapper';

const WorkspacePage: React.FC = () => {
  const [{ activeWorld, activeMap }, appActions] = useModel(AppModel);
  const [{ activeLayer }] = useModel(LayerModel);
  const [, engineDataActions] = useModel(EngineDataModel);
  const [, userInteractions] = useModel(UserInteractionsModel);
  const location = useLocation();
  const navigate = useNavigate();
  const { mapId } = useParams<{ mapId: string }>();
  const [ready, setReady] = useState(false);
  const [userConfig, setUserConfig] = useState<UserMapMetadata>();

  useEffect(() => {
    if (!activeMap) {
      if (!mapId) {
        console.error('No mapId detected in URL');
        return;
      }
      console.log('[Workspace] Getting Map Details for Map:', mapId);
      GetUserMap(mapId).then(res => {
        const { map, userMetadata } = res;
        console.log('[Workspace] Fetched Map:', map, userMetadata);
        appActions.setMaps([map]);
        appActions.setActiveMap(map);
        setUserConfig(userMetadata);
      });
    } else {
      const { userMetadata } = location.state;
      console.log('[Workspace] Active Map:', activeMap);
      setUserConfig(userMetadata);
    }
  }, [activeMap]);

  useEffect(() => {
    const searchQuery = location.search.substring(1);
    const layerId = searchQuery
      .split('&')
      .find(s => s.includes('layer='))
      ?.split('=')[1];
    if (activeMap && userConfig) {
      const startingLayer =
        activeLayer ??
        activeMap.layers.find(l => l.id === layerId) ??
        activeMap.layers.find(l => l.id === userConfig.layerId) ??
        activeMap.layers[0];
      console.log(
        '[Workspace] Initialising EngineData with Map:',
        activeMap,
        'UserConfig:',
        userConfig,
        'Starting Layer:',
        startingLayer,
      );
      if (!startingLayer && activeMap && activeWorld) {
        console.error('[Workspace] No starting layer found');
        navigate(`/world/${activeWorld.id}/${activeMap.id}`);
      }
      engineDataActions.initialise(activeMap, userConfig, startingLayer);
      const overlays = activeMap.layers.flatMap(l => l.overlays ?? []);
      const templates = (activeMap.templateGroups ?? []).flatMap(
        t => t.markerTemplates,
      );
      userInteractions.overlayUsed(overlays[0]);
      userInteractions.templateUsed(templates[0]);
      setReady(true);
    }
  }, [activeMap, userConfig, activeLayer]);

  return <>{ready ? <ImagiMapper /> : <div>Loading</div>}</>;
};

export default WorkspacePage;
