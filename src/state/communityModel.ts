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
          console.log('Recalculating activeWorld');
          return state.worlds?.find(w => w.viewing === true);
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
          console.log('Called setViewingWorld:', world);
          state.worlds = state.worlds.map(w => {
            if (w.id === world.id) {
              console.log('Setting viewing world:', w);
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
        },
        clearMaps: (state: CommunityModelState) => {
          state.maps = [];
        },
        setViewingMap: (state: CommunityModelState, map: Map) => {
          state.maps = state.maps.map(m => {
            if (m.id === map.id) {
              return { ...m, currentlyAccessed: true };
            } else {
              return { ...m, currentlyAccessed: false };
            }
          });
        },
      },
    };
  },
);
