import { model } from '@modern-js/runtime/model';
import { ulid } from 'ulid';

import { WorldSpaceCoords } from '@shared/_types';

type IsChanged = boolean;
type PolygonPoint = { id: string } & WorldSpaceCoords;

export type StagedPolygon = {
  id?: string;
  _points: [IsChanged, PolygonPoint[], PolygonPoint[]];
  isNew: boolean;
};

export const StagedPolygonModel = model<StagedPolygon>('StagedPolygon').define(
  (_, { onMount }) => {
    onMount(() => {
      console.log('StagedPolygonModel mounted');
    });

    return {
      state: {
        id: undefined,
        _points: [false, [], []],
        isNew: false,
      },
      computed: {
        points: (state: StagedPolygon) => {
          return state._points[2] ?? state._points[1] ?? [];
        },
      },
      actions: {
        startNewPolygon: (
          state: StagedPolygon,
          startingPosition: WorldSpaceCoords,
        ) => {
          const point = { id: ulid(), ...startingPosition };
          state._points = [true, [], [point]];
          state.isNew = true;
        },
        addPoint(state: StagedPolygon, position: WorldSpaceCoords) {
          const point = { id: ulid(), ...position };
          state._points[1].push(point);
        },
      },
    };
  },
);
