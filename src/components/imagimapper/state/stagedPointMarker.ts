import { model } from '@modern-js/runtime/model';
import { v7 } from 'uuid';
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
  _id?: [IsChanged, OldStrValue, NewStrValue];
  _type?: [IsChanged, OldTypeValue, OldTypeValue];
  _name?: [IsChanged, OldStrValue, NewStrValue];
  _description?: [IsChanged, OldStrValue, NewStrValue];
  _position?: [IsChanged, OldPosValue, NewPosValue];
  _templateId?: [IsChanged, OldStrValue, NewStrValue];
  _overlayId?: [IsChanged, OldStrValue, NewStrValue];
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
      _id: undefined,
      _type: undefined,
      _name: undefined,
      _description: undefined,
      _position: undefined,
      _templateId: undefined,
      _overlayId: undefined,
    } as StagedPointMarkerData,
    computed: {
      id: (state: StagedPointMarkerData) => {
        const id = state._id?.[2] ?? state._id?.[1];
        console.log('[Staged Data Model] Compute ID:', id);
        return id;
      },
      type: (state: StagedPointMarkerData) => {
        return state._type?.[2] ?? state._type?.[1];
      },
      name: (state: StagedPointMarkerData) => {
        return state._name?.[2] ?? state._name?.[1] ?? 'default_name';
      },
      description: (state: StagedPointMarkerData) => {
        return (
          state._description?.[2] ??
          state._description?.[1] ??
          'default_description'
        );
      },
      position: (state: StagedPointMarkerData) => {
        return state._position?.[2] ?? state._position?.[1] ?? { x: 0, y: 0 };
      },
      templateId: (state: StagedPointMarkerData) => {
        return (
          state._templateId?.[2] ??
          state._templateId?.[1] ??
          'default_templateId'
        );
      },
      overlayId: (state: StagedPointMarkerData) => {
        return (
          state._overlayId?.[2] ?? state._overlayId?.[1] ?? 'default_overlayId'
        );
      },
      isChanged: (state: StagedPointMarkerData) => {
        return Object.entries(state)
          .filter(([key]) => key !== 'isNew')
          .some(([, value]) => Array.isArray(value) && value[0]);
      },
      typeChanged: (state: StagedPointMarkerData) => {
        return state._type?.[0] ?? false;
      },
      nameChanged: (state: StagedPointMarkerData) => {
        return state._name?.[0] ?? false;
      },
      descriptionChanged: (state: StagedPointMarkerData) => {
        return state._description?.[0] ?? false;
      },
      positionChanged: (state: StagedPointMarkerData) => {
        return state._position?.[0] ?? false;
      },
      templateIdChanged: (state: StagedPointMarkerData) => {
        return state._templateId?.[0] ?? false;
      },
      overlayIdChanged: (state: StagedPointMarkerData) => {
        return state._overlayId?.[0] ?? false;
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
              id: state._id?.[2] ?? state._id?.[1] ?? '',
              type: 'Marker',
              name: state._name?.[2] ?? state._name?.[1] ?? '',
              description:
                state._description?.[2] ?? state._description?.[1] ?? '',
              position: state._position?.[2] ??
                state._position?.[1] ?? { x: 0, y: 0 },
              templateId:
                state._templateId?.[2] ?? state._templateId?.[1] ?? '',
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
        console.log(
          '[Staged Data Model] createNewPointMarker',
          template,
          initialPosition,
        );
        state._id = [false, undefined, v7()];
        state._type = [false, 'Marker', undefined];
        state._name = [false, template.name, undefined];
        state._description = [false, template.description, undefined];
        state._position = [false, undefined, initialPosition];
        state._templateId = [false, template.id, undefined];
        state._overlayId = [false, undefined, undefined];
        state.isNew = true;
      },
      hydrateFromPointMapMarker: (
        state: StagedPointMarkerData,
        mapMarker: MapMarker,
      ) => {
        const markerOverlay = overlays.find(o => {
          return o.markers.some(m => m.id === mapMarker.id);
        });
        state._id = [false, mapMarker.id, undefined];
        state._type = [false, mapMarker.type, undefined];
        state._name = [false, mapMarker.name, undefined];
        state._description = [false, mapMarker.description, undefined];
        state._position = [false, mapMarker.position, undefined];
        state._templateId = [false, mapMarker.templateId, undefined];
        state._overlayId = [false, markerOverlay?.id, undefined];
        state.isNew = false;
      },
      setId: (state: StagedPointMarkerData, id: string) => {
        const changed = state._id?.[1] !== id;
        state._id = [changed, state._id?.[1], id];
      },
      setType: (state: StagedPointMarkerData, type: MarkerType) => {
        const changed = state._type?.[1] !== type;
        state._type = [changed, state._type?.[1], type];
      },
      setName: (state: StagedPointMarkerData, name: string) => {
        const changed = state._name?.[1] !== name;
        state._name = [changed, state._name?.[1], name];
      },
      setDescription: (state: StagedPointMarkerData, description: string) => {
        const changed = state._description?.[1] !== description;
        state._description = [changed, state._description?.[1], description];
      },
      setPosition: (
        state: StagedPointMarkerData,
        position: { x: number; y: number },
      ) => {
        const changed = state._position?.[1] !== position;
        state._position = [changed, state._position?.[1], position];
      },
      setTemplateId: (state: StagedPointMarkerData, templateId: string) => {
        const changed = state._templateId?.[1] !== templateId;
        state._templateId = [changed, state._templateId?.[1], templateId];
      },
      setOverlayId: (state: StagedPointMarkerData, overlayId: string) => {
        const changed = state._overlayId?.[1] !== overlayId;
        state._overlayId = [changed, state._overlayId?.[1], overlayId];
      },
      undoTypeChange: (state: StagedPointMarkerData) => {
        state._type = [false, state._type?.[1], undefined];
      },
      undoNameChange: (state: StagedPointMarkerData) => {
        state._name = [false, state._name?.[1], undefined];
      },
      undoDescriptionChange: (state: StagedPointMarkerData) => {
        state._description = [false, state._description?.[1], undefined];
      },
      undoPositionChange: (state: StagedPointMarkerData) => {
        state._position = [false, state._position?.[1], undefined];
      },
      undoTemplateChange: (state: StagedPointMarkerData) => {
        state._templateId = [false, state._templateId?.[1], undefined];
      },
      undoOverlayChange: (state: StagedPointMarkerData) => {
        state._overlayId = [false, state._overlayId?.[1], undefined];
      },
      undoChanges: (state: StagedPointMarkerData) => {
        state._id = [false, state._id?.[1], undefined];
        state._type = [false, state._type?.[1], undefined];
        state._name = [false, state._name?.[1], undefined];
        state._description = [false, state._description?.[1], undefined];
        state._position = [false, state._position?.[1], undefined];
        state._templateId = [false, state._templateId?.[1], undefined];
        state._overlayId = [false, state._overlayId?.[1], undefined];
      },
      resetStagedPointMarker: (state: StagedPointMarkerData) => {
        state._id = undefined;
        state._type = undefined;
        state._name = undefined;
        state._description = undefined;
        state._position = undefined;
        state._templateId = undefined;
        state._overlayId = undefined;
        state.isNew = false;
      },
    },
  };
});
