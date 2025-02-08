import { model } from '@modern-js/runtime/model';
import { Community } from '@shared/types/community';
import { World } from '@shared/types/world';
import { Map, MapLayer } from '@shared/_types';

type AppModelState = {
  community?: Community;
  worlds: World[];
  maps: Map[];
  layers: MapLayer[];
};

const AppModelDefault: AppModelState = {
  worlds: [],
  maps: [],
  layers: [],
};

export const AppModel = model<AppModelState>('app').define(_ => {
  return {
    state: AppModelDefault,
    computed: {
      activeWorld: (state: AppModelState) => {
        return state.worlds?.find(w => w.active === true);
      },
      activeMap: (state: AppModelState) => {
        return state.maps?.find(m => m.active === true);
      },
      activeLayer: (state: AppModelState) => {
        return state.layers?.find(l => l.active === true);
      },
    },
    actions: {
      setCommunity: (state: AppModelState, community: Community) => {
        state.community = community;
      },
      clearCommunity: (state: AppModelState) => {
        state.community = undefined;
      },
      setWorlds: (state: AppModelState, worlds: World[]) => {
        state.worlds = worlds;
      },
      setViewingWorld: (state: AppModelState, world: World) => {
        const currentActiveWorld = state.worlds.find(w => w.active === true);
        if (currentActiveWorld?.id !== world.id) {
          state.maps = [];
        }
        state.worlds = state.worlds.map(w => {
          if (w.id === world.id) {
            return { ...w, active: true };
          } else {
            return { ...w, active: false };
          }
        });
      },
      clearWorlds: (state: AppModelState) => {
        state.worlds = [];
      },
      addWorld: (state: AppModelState, world: World) => {
        if (!state.worlds.some(w => w.id === world.id)) {
          state.worlds = [...state.worlds, world];
        }
      },
      updateWorld: (state: AppModelState, world: World) => {
        state.worlds = state.worlds.map(w => (w.id === world.id ? world : w));
      },
      setMaps: (state: AppModelState, maps: Map[]) => {
        state.maps = maps;
      },
      addMap: (state: AppModelState, map: Map) => {
        state.maps = [...state.maps, map];
        state.worlds?.find(w => w.active === true)?.mapIds.push(map.id);
      },
      updateMap: (state: AppModelState, map: Map) => {
        state.maps = state.maps.map(m => (m.id === map.id ? map : m));
      },
      clearMaps: (state: AppModelState) => {
        state.maps = [];
      },
      setActiveMap: (state: AppModelState, map: Map) => {
        state.maps = state.maps.map(m => {
          if (m.id === map.id) {
            return { ...m, active: true };
          } else {
            return { ...m, active: false };
          }
        });
      },
      setLayers: (state: AppModelState, layers: MapLayer[]) => {
        state.layers = layers;
      },
      addLayer: (state: AppModelState, layer: MapLayer) => {
        state.layers = [...state.layers, layer];
      },
      updateLayer: (state: AppModelState, layer: MapLayer) => {
        state.layers = state.layers.map(l => (l.id === layer.id ? layer : l));
      },
      deleteLayer: (state: AppModelState, layerId: string) => {
        state.layers = state.layers.filter(l => l.id !== layerId);
      },
      clearLayers: (state: AppModelState) => {
        state.layers = [];
      },
      setActiveLayer: (state: AppModelState, layer: MapLayer) => {
        state.layers = state.layers.map(l => {
          if (l.id === layer.id) {
            return { ...l, active: true };
          } else {
            return { ...l, active: false };
          }
        });
      },
    },
  };
});
