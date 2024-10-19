import { model } from '@modern-js/runtime/model';
import {
  DisplayTemplate,
  MapMarker,
  MarkerType,
  WorldSpaceCoords,
} from '@shared/_types';
import { EngineDataModel } from './engineData';

type IsChanged = boolean;
type OldStrValue = string | undefined;
type NewStrValue = string | undefined;
type OldTypeValue = MarkerType | undefined;
type OldPosValue = { x: number; y: number } | undefined;
type NewPosValue = { x: number; y: number } | undefined;

export type StagedPointMarkerData = {
  id?: [IsChanged, OldStrValue, NewStrValue];
  type?: [IsChanged, OldTypeValue, OldTypeValue];
  name?: [IsChanged, OldStrValue, NewStrValue];
  description?: [IsChanged, OldStrValue, NewStrValue];
  position?: [IsChanged, OldPosValue, NewPosValue];
  templateId?: [IsChanged, OldStrValue, NewStrValue];
  overlayId?: [IsChanged, OldStrValue, NewStrValue];
  isNew: boolean;
};

export const StagedPointMarkerModel = model<StagedPointMarkerData>(
  'StagedData',
).define((_, { onMount, use }) => {
  const [{ overlays }] = use(EngineDataModel);

  onMount(() => {
    console.log('StagedData Model Mounted');
  });

  return {
    state: {
      isNew: false,
      id: undefined,
      type: undefined,
      name: undefined,
      description: undefined,
      position: undefined,
      templateId: undefined,
      overlayId: undefined,
    } as StagedPointMarkerData,
    computed: {
      isChanged: (state: StagedPointMarkerData) => {
        return Object.entries(state)
          .filter(([key]) => key !== 'isNew')
          .some(([, value]) => Array.isArray(value) && value[0]);
      },
      typeChanged: (state: StagedPointMarkerData) => {
        return state.type?.[0] ?? false;
      },
      nameChanged: (state: StagedPointMarkerData) => {
        return state.name?.[0] ?? false;
      },
      descriptionChanged: (state: StagedPointMarkerData) => {
        return state.description?.[0] ?? false;
      },
      positionChanged: (state: StagedPointMarkerData) => {
        return state.position?.[0] ?? false;
      },
      templateIdChanged: (state: StagedPointMarkerData) => {
        return state.templateId?.[0] ?? false;
      },
      overlayIdChanged: (state: StagedPointMarkerData) => {
        return state.overlayId?.[0] ?? false;
      },
      mapMarker: (state: StagedPointMarkerData) => {
        console.log('[Staged Data Model] Compute MapMarker:', state);
        const markerInitialised = Object.entries(state).reduce(
          (acc, [key, value]) => {
            // console.log('[Staged Data Model] key, value:', key, value);
            if (key === 'isNew') {
              return acc;
            }
            return acc && value !== undefined;
          },
          true,
        );
        console.log(
          '[Staged Data Model] mapMarker: markerInitialised:',
          markerInitialised,
        );
        return markerInitialised
          ? ({
              id: state.id?.[2] ?? state.id?.[1] ?? '',
              type: 'Marker',
              name: state.name?.[2] ?? state.name?.[1] ?? '',
              description:
                state.description?.[2] ?? state.description?.[1] ?? '',
              position: state.position?.[2] ??
                state.position?.[1] ?? { x: 0, y: 0 },
              templateId: state.templateId?.[2] ?? state.templateId?.[1] ?? '',
            } as MapMarker)
          : undefined;
      },
    },
    actions: {
      createNewPointMarker: (
        state: StagedPointMarkerData,
        template: DisplayTemplate,
        initialPosition?: WorldSpaceCoords,
      ) => {
        state.id = [false, undefined, undefined];
        state.type = [false, 'Marker', undefined];
        state.name = [false, template.name, undefined];
        state.description = [false, template.description, undefined];
        state.position = [false, undefined, initialPosition];
        state.templateId = [false, template.id, undefined];
        state.overlayId = [false, undefined, undefined];
        state.isNew = true;
      },
      hydrateFromPointMapMarker: (
        state: StagedPointMarkerData,
        mapMarker: MapMarker,
      ) => {
        const markerOverlay = overlays.find(o => {
          return o.markers.some(m => m.id === mapMarker.id);
        });
        state.id = [false, mapMarker.id, undefined];
        state.type = [false, mapMarker.type, undefined];
        state.name = [false, mapMarker.name, undefined];
        state.description = [false, mapMarker.description, undefined];
        state.position = [false, mapMarker.position, undefined];
        state.templateId = [false, mapMarker.templateId, undefined];
        state.overlayId = [false, markerOverlay?.id, undefined];
        state.isNew = false;
      },
      setId: (state: StagedPointMarkerData, id: string) => {
        const changed = state.id?.[1] !== id;
        state.id = [changed, state.id?.[1], id];
      },
      setType: (state: StagedPointMarkerData, type: MarkerType) => {
        const changed = state.type?.[1] !== type;
        state.type = [changed, state.type?.[1], type];
      },
      setName: (state: StagedPointMarkerData, name: string) => {
        const changed = state.name?.[1] !== name;
        state.name = [changed, state.name?.[1], name];
      },
      setDescription: (state: StagedPointMarkerData, description: string) => {
        const changed = state.description?.[1] !== description;
        state.description = [changed, state.description?.[1], description];
      },
      setPosition: (
        state: StagedPointMarkerData,
        position: { x: number; y: number },
      ) => {
        const changed = state.position?.[1] !== position;
        state.position = [changed, state.position?.[1], position];
      },
      setTemplateId: (state: StagedPointMarkerData, templateId: string) => {
        const changed = state.templateId?.[1] !== templateId;
        state.templateId = [changed, state.templateId?.[1], templateId];
      },
      setOverlayId: (state: StagedPointMarkerData, overlayId: string) => {
        const changed = state.overlayId?.[1] !== overlayId;
        state.overlayId = [changed, state.overlayId?.[1], overlayId];
      },
      undoTypeChange: (state: StagedPointMarkerData) => {
        state.type = [false, state.type?.[1], undefined];
      },
      undoNameChange: (state: StagedPointMarkerData) => {
        state.name = [false, state.name?.[1], undefined];
      },
      undoDescriptionChange: (state: StagedPointMarkerData) => {
        state.description = [false, state.description?.[1], undefined];
      },
      undoPositionChange: (state: StagedPointMarkerData) => {
        state.position = [false, state.position?.[1], undefined];
      },
      undoTemplateChange: (state: StagedPointMarkerData) => {
        state.templateId = [false, state.templateId?.[1], undefined];
      },
      undoOverlayChange: (state: StagedPointMarkerData) => {
        state.overlayId = [false, state.overlayId?.[1], undefined];
      },
      undoChanges: (state: StagedPointMarkerData) => {
        state.id = [false, state.id?.[1], undefined];
        state.type = [false, state.type?.[1], undefined];
        state.name = [false, state.name?.[1], undefined];
        state.description = [false, state.description?.[1], undefined];
        state.position = [false, state.position?.[1], undefined];
        state.templateId = [false, state.templateId?.[1], undefined];
        state.overlayId = [false, state.overlayId?.[1], undefined];
      },
      resetStagedPointMarker: (state: StagedPointMarkerData) => {
        state.id = undefined;
        state.type = undefined;
        state.name = undefined;
        state.description = undefined;
        state.position = undefined;
        state.templateId = undefined;
        state.overlayId = undefined;
        state.isNew = false;
      },
    },
  };
});
