import { model } from '@modern-js/runtime/model';
import {
  DisplayTemplate,
  Map,
  MapLayer,
  MapMarker,
  Overlay,
  TemplateGroup,
  UserMapMetadata,
} from '@shared/_types';
import { LatLng } from 'leaflet';
import { ulid } from 'ulid';
import { xy } from '../_coordTranslators';

export type EngineData = {
  userConfig: UserMapMetadata;
  map: Map;
  activeLayer?: MapLayer;
  templateGroups: TemplateGroup[];
  runtime: {
    selectedMarker?: MapMarker;
    selectedMarkerIsNew: boolean;
    selectedTemplate?: DisplayTemplate;
    stagedMarker?: Partial<MapMarker>;
    ghostTargetPosition?: LatLng;
    lastTouchedOverlay?: Overlay;
    lastUsedTemplate?: DisplayTemplate;
  };
};

const EngineDataDefaults: EngineData = {
  map: {
    type: 'Map',
    id: '',
    name: '',
    description: '',
    layers: [],
    boundingTopography: {
      position: { x: 0, y: 0 },
      bounds: { top: 0, left: 0, bottom: 0, right: 0 },
      scale: { x: 1, y: 1 },
    },
  },
  userConfig: {
    position: { x: 0, y: 0 },
    zoom: 1,
    layerId: '',
  },
  templateGroups: [],
  runtime: {
    selectedMarkerIsNew: false,
  },
};

// TODO: Split into separate models
export const EngineDataModel = model('engineData').define((_, { onMount }) => {
  onMount(() => {
    console.log('EngineDataModel mounted');
  });
  return {
    state: EngineDataDefaults,
    computed: {
      selectedMarkerOverlay: (state: EngineData) => {
        return state.map.layers
          .flatMap(l => l.overlays)
          .find(o =>
            o?.markers.some(m => m.id === state.runtime.selectedMarker?.id),
          );
      },
      newMarkerOverlay: (state: EngineData) => {
        const overlays = state.map.layers.flatMap(l => l.overlays);
        return (
          overlays.find(o => o?.id === state.runtime.lastTouchedOverlay?.id) ??
          overlays[0]
        );
      },
      overlays: (state: EngineData): Overlay[] => {
        const overlays = state.map.layers.flatMap(l => l.overlays ?? []);
        console.log('Computed overlays', overlays, state);
        return overlays;
      },
    },
    actions: {
      initialise: (
        state: EngineData,
        map: Map,
        userConfig: UserMapMetadata,
        activeLayer?: MapLayer,
      ) => {
        state.map = map;
        state.templateGroups = map.templateGroups ?? [];
        state.userConfig = userConfig;
        state.activeLayer =
          activeLayer ??
          map.layers.find(l => l.id === userConfig.layerId) ??
          map.layers[0];
        state.runtime.lastUsedTemplate =
          map.templateGroups?.[0]?.markerTemplates[0];
        state.runtime.selectedTemplate = state.runtime.lastUsedTemplate;
      },
      setMapData: (state: EngineData, map: Map) => {
        state.map = map;
        state.templateGroups = map.templateGroups ?? [];
      },
      createPointMarker: (
        state: EngineData,
        marker: MapMarker,
        overlay: Overlay | string,
      ) => {
        // TODO: Revisit this logic if lists get big
        console.log('Creating Point Marker', marker, overlay);
        const overlayId = typeof overlay === 'string' ? overlay : overlay.id;
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(o => {
            if (o.id === overlayId) {
              o.markers.push(marker);
            }
            return o;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
      },
      updateMarker: (state: EngineData, marker: MapMarker) => {
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(o => {
            const index = o.markers.findIndex(m => m.id === marker.id);
            if (index >= 0) {
              o.markers[index] = marker;
            }
            return o;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
      },
      moveMarkerToOverlay: (
        state: EngineData,
        marker: MapMarker,
        targetOverlay: Overlay,
      ) => {
        let oldRemoved = false;
        let newAdded = false;
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(overlay => {
            if (overlay.id === targetOverlay.id) {
              overlay.markers.push(marker);
              newAdded = true;
            }
            const index = overlay.markers.findIndex(m => m.id === marker.id);
            if (index >= 0) {
              if (overlay.id !== targetOverlay.id) {
                overlay.markers.splice(index, 1);
                oldRemoved = true;
              } else {
                console.warn('Marker already exists in target overlay');
                return overlay;
              }
            }
            return overlay;
          });
          return { ...layer, overlays };
        });
        if (!oldRemoved || !newAdded) {
          console.error('Failed to move marker to target overlay');
          return;
        }
        state.map.layers = updatedLayers;
      },
      stageNewMarkerAt: (state: EngineData, position: Point) => {
        console.log('Data available to create new Point Marker', position, {
          ...state,
        });
        const initialTemplate = state.runtime.lastUsedTemplate;
        const placeholder = 'Placeholder';
        const marker: MapMarker = {
          id: ulid(),
          type: 'Marker',
          name: initialTemplate?.name ?? placeholder,
          description: initialTemplate?.description ?? placeholder,
          position: { ...position },
          templateId: initialTemplate?.id ?? placeholder,
        };
        console.log(
          'Adding new Point Marker',
          marker,
          state.runtime.selectedMarker,
        );
        state.runtime.stagedMarker = marker;
        state.runtime.selectedMarker = marker;
        state.runtime.selectedMarkerIsNew = true;
      },
      selectMarker: (state: EngineData, marker: MapMarker) => {
        state.runtime.selectedMarker = marker;
        state.runtime.selectedMarkerIsNew = false;
      },
      deselectMarker: (state: EngineData) => {
        state.runtime.selectedMarker = undefined;
        state.runtime.selectedMarkerIsNew = false;
      },
      deleteMarker: (state: EngineData, marker: MapMarker) => {
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(o => {
            const index = o.markers.findIndex(m => m.id === marker.id);
            if (index >= 0) {
              o.markers.splice(index, 1);
            }
            return o;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
        state.runtime.selectedMarker = undefined;
      },
      cancelCreatePointMarker: (state: EngineData) => {
        state.runtime.stagedMarker = undefined;
      },
      overlayTouched: (state: EngineData, overlay: Overlay) => {
        state.runtime.lastTouchedOverlay = overlay;
      },
      abandonAllEdits: (state: EngineData) => {
        state.runtime.selectedMarker = undefined;
        state.runtime.stagedMarker = undefined;
      },
      showGhostTarget: (state: EngineData, position: Point) => {
        const latlng = xy(position.x, position.y);
        state.runtime.ghostTargetPosition = latlng;
      },
      hideGhostTarget: (state: EngineData) => {
        state.runtime.ghostTargetPosition = undefined;
      },
    },
  };
});
