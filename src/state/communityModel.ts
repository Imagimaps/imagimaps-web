import { model } from '@modern-js/runtime/model';
import { Community } from '@shared/types/community';
import { Map } from '@shared/types/map';
import { World } from '@shared/types/world';

type CommunityModelState = {
  community?: Community;
  worlds: World[];
  maps: Map[];
};

const CommunityModelStateDefault: CommunityModelState = {
  worlds: [],
  maps: [],
};

export const CommunityModel = model<CommunityModelState>('community').define(
  _ => {
    return {
      state: CommunityModelStateDefault,
      computed: {
        activeWorld: (state: CommunityModelState) => {
          return state.worlds?.find(w => w.viewing === true);
        },
        activeMap: (state: CommunityModelState) => {
          return state.maps?.find(m => m.viewing === true);
        },
      },
      actions: {
        setCommunity: (state: CommunityModelState, community: Community) => {
          state.community = community;
        },
        clearCommunity: (state: CommunityModelState) => {
          state.community = undefined;
        },
        setWorlds: (state: CommunityModelState, worlds: World[]) => {
          state.worlds = worlds;
        },
        setViewingWorld: (state: CommunityModelState, world: World) => {
          const currentActiveWorld = state.worlds.find(w => w.viewing === true);
          if (currentActiveWorld?.id !== world.id) {
            state.maps = [];
          }
          state.worlds = state.worlds.map(w => {
            if (w.id === world.id) {
              return { ...w, viewing: true };
            } else {
              return { ...w, viewing: false };
            }
          });
        },
        clearWorlds: (state: CommunityModelState) => {
          state.worlds = [];
        },
        addWorld: (state: CommunityModelState, world: World) => {
          state.worlds = [...state.worlds, world];
        },
        setMaps: (state: CommunityModelState, maps: Map[]) => {
          state.maps = maps;
        },
        addMap: (state: CommunityModelState, map: Map) => {
          state.maps = [...state.maps, map];
          state.worlds?.find(w => w.viewing === true)?.mapIds.push(map.id);
        },
        clearMaps: (state: CommunityModelState) => {
          state.maps = [];
        },
        setViewingMap: (state: CommunityModelState, map: Map) => {
          state.maps = state.maps.map(m => {
            if (m.id === map.id) {
              return { ...m, viewing: true };
            } else {
              return { ...m, viewing: false };
            }
          });
        },
      },
    };
  },
);
