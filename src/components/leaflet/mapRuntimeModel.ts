import { nanoid } from 'nanoid/non-secure';
import { DisplayTemplate, MapMarker, Overlay } from '@shared/_types';
import { model } from '@modern-js/runtime/model';
import { LatLng } from 'leaflet';
import { MapData, MapDataModel } from './mapDataModel';
import { xy } from './mapView';

export type MapRuntime = {
  selectedMarker?: MapMarker;
  templateIdHistory: string[];
  selectedMarkerIsNew: boolean;
  stagedMarker?: Partial<MapMarker>;
  recentOverlayId?: string;
  lastUsedTemplate?: DisplayTemplate;
  lastUsedOverlay?: Overlay;
  ghostTargetPosition?: LatLng;
};

export const MapRuntimeDefault: MapRuntime = {
  templateIdHistory: [],
  selectedMarker: undefined,
  selectedMarkerIsNew: false,
};

export const MapRuntimeModel = model('mapRuntime').define((_, { onMount }) => {
  onMount(() => {
    console.log('MapRuntimeModel mounted');
  });
  return {
    state: MapRuntimeDefault,
    computed: {
      selectedOverlay: [
        MapDataModel,
        (state: MapRuntime, dataState: MapData) => {
          const overlays = dataState.map.layers.flatMap(l => l.overlays);
          if (state.selectedMarkerIsNew) {
            console.log(
              'Computing selected overlay for new marker',
              state.recentOverlayId,
            );
            const selectedOverlay = overlays.find(
              o => o?.id === state.recentOverlayId,
            );
            if (selectedOverlay) {
              console.log('Selected overlay for new marker', selectedOverlay);
              return selectedOverlay;
            }
          }
          return overlays.find(overlay =>
            overlay?.markers.some(m => m.id === state.selectedMarker?.id),
          );
        },
      ],
      selectedTemplate: [
        MapDataModel,
        (state: MapRuntime, dataState: MapData) => {
          if (state.selectedMarker) {
            return (dataState.map.templateGroups ?? [])
              .flatMap(group => group.markerTemplates)
              .find(
                template => template.id === state.selectedMarker?.templateId,
              );
          }
          return undefined;
        },
      ],
    },
    actions: {
      markerSelected: (state: MapRuntime, marker: MapMarker) => {
        state.selectedMarkerIsNew = false;
        state.selectedMarker = marker;
      },
      markerDeselected: (state: MapRuntime) => {
        state.selectedMarker = undefined;
      },
      clearAllEdits: (state: MapRuntime) => {
        state.selectedMarker = undefined;
        state.stagedMarker = undefined;
      },
      templateInteracted: (state: MapRuntime, template: DisplayTemplate) => {
        state.templateIdHistory.push(template.id);
        state.lastUsedTemplate = template;
      },
      overlayInteracted: (state: MapRuntime, overlay: Overlay) => {
        console.log('Overlay interacted with', overlay.id);
        state.recentOverlayId = overlay.id;
        state.lastUsedOverlay = overlay;
      },
      createMarkerAt: (state: MapRuntime, position: Point) => {
        console.log('Data available to create new Point Marker', position, {
          ...state,
        });
        // const thisModel = use(MapRuntimeModel);
        const initialTemplate = state.lastUsedTemplate;
        const placeholder = String.fromCharCode(26); // Character 26 is the SUB control character
        const marker: MapMarker = {
          id: nanoid(6),
          type: 'Marker',
          name: initialTemplate?.name ?? placeholder,
          description: initialTemplate?.description ?? placeholder,
          position: { ...position },
          templateId: initialTemplate?.id ?? placeholder,
        };
        console.log('Adding new Point Marker', marker, state.selectedMarker);
        state.stagedMarker = marker;
        state.selectedMarker = marker;
        state.selectedMarkerIsNew = true;
      },
      cancelCreatePointMarker: (state: MapRuntime) => {
        state.stagedMarker = undefined;
      },
      showGhostTarget: (state: MapRuntime, position: Point) => {
        const latlng = xy(position.x, position.y);
        state.ghostTargetPosition = latlng;
      },
      hideGhostTarget: (state: MapRuntime) => {
        state.ghostTargetPosition = undefined;
      },
    },
  };
});
