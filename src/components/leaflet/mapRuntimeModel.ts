import { nanoid } from 'nanoid/non-secure';
import { DisplayTemplate, MapMarker, MapOverlay } from '@shared/_types';
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
  lastUsedOverlay?: MapOverlay;
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
          if (state.selectedMarkerIsNew) {
            console.log(
              'Computing selected overlay for new marker',
              state.recentOverlayId,
            );
            const overlay = dataState.map.topology.overlays.find(
              overlay => overlay.id === state.recentOverlayId,
            );
            if (overlay) {
              console.log('Selected overlay for new marker', overlay);
              return overlay;
            }
            return dataState.map.topology.overlays[0];
          }
          return dataState.map.topology.overlays.find(overlay =>
            overlay.markers.some(m => m.id === state.selectedMarker?.id),
          );
        },
      ],
      selectedTemplate: [
        MapDataModel,
        (state: MapRuntime, dataState: MapData) => {
          if (state.selectedMarker) {
            return dataState.map.templateGroups
              .flatMap(group => group.templates)
              .find(
                template => template.id === state.selectedMarker?.refTemplateid,
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
      overlayInteracted: (state: MapRuntime, overlay: MapOverlay) => {
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
          refTemplateid: initialTemplate?.id ?? placeholder,
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
