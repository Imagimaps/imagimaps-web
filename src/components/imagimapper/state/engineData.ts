import { model } from '@modern-js/runtime/model';
import {
  Map as UserMap,
  MapLayer,
  MapMarker,
  MapShared,
  Overlay,
  TemplateGroup,
  UserMapMetadata,
} from '@shared/_types';

export type EngineData = {
  userConfig: UserMapMetadata;
  map: UserMap;
  activeLayer?: MapLayer;
  templateGroups: TemplateGroup[];
  hiddenOverlays: string[];
  filterPattern?: string;
};

const EngineDataDefaults: EngineData = {
  map: {
    type: 'Map',
    id: '',
    intrinsics: {
      name: '',
      description: '',
    },
    layers: [],
    boundingTopography: {
      position: { x: 0, y: 0 },
      bounds: { top: 0, left: 0, bottom: 0, right: 0 },
      scale: { x: 1, y: 1 },
    },
    shared: MapShared.Private,
  },
  userConfig: {
    position: { x: 0, y: 0 },
    zoom: 1,
    layerId: '',
  },
  templateGroups: [],
  hiddenOverlays: [],
};

// TODO: Split into separate models
export const EngineDataModel = model('engineData').define((_, { onMount }) => {
  onMount(() => {
    console.log('EngineDataModel mounted');
  });
  return {
    state: EngineDataDefaults,
    computed: {
      overlays: (state: EngineData): Overlay[] => {
        const overlays = state.map.layers.flatMap(l => l.overlays ?? []);
        console.log('Computed overlays', overlays, state);
        return overlays;
      },
      templates: (state: EngineData) => {
        return state.templateGroups.flatMap(g => g.markerTemplates);
      },
    },
    actions: {
      initialise: (
        state: EngineData,
        map: UserMap,
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
        console.log(
          `[EngineData] Initialised MapId: ${state.map.id}, LayerId: ${state.activeLayer?.id}`,
        );
      },
      setMapData: (state: EngineData, map: UserMap) => {
        state.map = map;
        state.templateGroups = map.templateGroups ?? [];
      },
      setNewlyCreatedMarkerId: (state: EngineData, marker: MapMarker) => {
        console.log('[EngineData] Setting newly created marker ID', marker);
        console.log('[EngineData] Active Layer:', state.activeLayer);
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(o => {
            const index = o.markers.findIndex(m => !m.id);
            if (index >= 0) {
              const newMarker = o.markers[index];
              if (
                newMarker.position.x === marker.position.x &&
                newMarker.position.y === marker.position.y &&
                newMarker.type === marker.type &&
                newMarker.name === marker.name &&
                newMarker.description === marker.description &&
                newMarker.templateId === marker.templateId
              ) {
                console.log(
                  '[EngineData] Setting ID for marker',
                  newMarker,
                  marker,
                );
                o.markers[index] = marker;
              }
            }
            return o;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
      },
      createPointMarker: (
        state: EngineData,
        marker: MapMarker,
        overlay: Overlay | string,
      ) => {
        // TODO: Revisit this logic if lists get big
        console.log('[EngineData] Creating Point Marker', marker, overlay);
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
      deleteMarker: (state: EngineData, markerId: string) => {
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(o => {
            const index = o.markers.findIndex(m => m.id === markerId);
            if (index >= 0) {
              console.log('[EngineDataModel] Deleting marker', markerId);
              o.markers.splice(index, 1);
            }
            return o;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
      },
      hideOverlay: (state: EngineData, overlayId: string) => {
        console.log('[EngineDataModel] Hiding overlay', overlayId);
        const hiddenOverlays =
          state.hiddenOverlays ?? new Map<string, boolean>();
        const hiddenSet = new Set<string>(hiddenOverlays);
        hiddenSet.add(overlayId);
        state.hiddenOverlays = Array.from(hiddenSet);
      },
      showOverlay: (state: EngineData, overlayId: string) => {
        console.log('[EngineDataModel] Showing overlay', overlayId);
        const hiddenOverlays =
          state.hiddenOverlays ?? new Map<string, boolean>();
        const hiddenSet = new Set<string>(hiddenOverlays);
        hiddenSet.delete(overlayId);
        state.hiddenOverlays = Array.from(hiddenSet);
      },
    },
  };
});
