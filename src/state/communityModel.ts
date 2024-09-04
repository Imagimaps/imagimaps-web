import { model } from '@modern-js/runtime/model';
import { Community } from '@shared/types/community';
import { World } from '@shared/types/world';

type CommunityModelState = {
  community?: Community;
  worlds: World[];
};

const CommunityModelStateDefault: CommunityModelState = {
  worlds: [],
};

export const CommunityModel = model<CommunityModelState>('community').define(
  _ => {
    return {
      state: CommunityModelStateDefault,
      computed: {
        activeWorld: (state: CommunityModelState) => {
          return state.worlds?.find(w => w.currentlyAccessed === true);
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
        setActiveWorld: (state: CommunityModelState, world: World) => {
          state.worlds = state.worlds.map(w => {
            if (w.id === world.id) {
              return { ...w, currentlyAccessed: true };
            } else {
              return { ...w, currentlyAccessed: false };
            }
          });
        },
        clearWorlds: (state: CommunityModelState) => {
          state.worlds = [];
        },
      },
    };
  },
);
