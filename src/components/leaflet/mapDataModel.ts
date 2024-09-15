import {
  Map,
  MapLayer,
  MapMarker,
  MapMetadata,
  Overlay,
  UserMapMetadata,
} from '@shared/_types';
import { DefaultMap } from '@shared/_defaults';
import { model } from '@modern-js/runtime/model';

export type MapData = {
  map: Map;
  defaultConfig: MapMetadata;
  userConfig?: UserMapMetadata;
};

export const MapDataDefault: MapData = {
  map: DefaultMap,
  defaultConfig: {
    viewPosition: DefaultMap.boundingTopography.position,
    viewZoom: 1,
  },
};

export const MapDataModel = model('mapData').define(_ => {
  return {
    state: MapDataDefault,
    computed: {
      activeLayer: (state: MapData) => {
        console.log('Calculating active layer', state);
        return state.map.layers.find(
          layer => layer.id === state.userConfig?.layerId,
        );
      },
      overlays: (state: MapData): Overlay[] => {
        return state.map.layers.flatMap(layer => layer.overlays ?? []);
      },
    },
    actions: {
      setMap: (state: MapData, map: Map) => {
        state.map = map;
      },
      setDefaultConfig: (state: MapData, config: MapMetadata) => {
        state.defaultConfig = config;
      },
      setUserConfig: (state: MapData, config: UserMapMetadata) => {
        console.log('Setting user config:', config);
        state.userConfig = {
          position: { ...config.position },
          zoom: config.zoom,
          layerId: config.layerId,
        };
      },
      setActiveLayer: (state: MapData, layer: MapLayer) => {
        if (state.userConfig) {
          state.userConfig = { ...state.userConfig, layerId: layer.id };
        } else {
          console.error('User config not set');
        }
      },
      updateMarker: (state: MapData, marker: MapMarker) => {
        // TODO: Restrict (Maybe?) to only active layer
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(overlay => {
            const index = overlay.markers.findIndex(m => m.id === marker.id);
            if (index >= 0) {
              overlay.markers[index] = marker;
            }
            return overlay;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
      },
      moveMarkerToOverlay: (
        state: MapData,
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
      addNewMarker: (state: MapData, marker: MapMarker, overlay: Overlay) => {
        const updatedLayers = state.map.layers.map(layer => {
          const overlays = layer.overlays?.map(o => {
            if (o.id === overlay.id) {
              o.markers.push(marker);
            }
            return o;
          });
          return { ...layer, overlays };
        });
        state.map.layers = updatedLayers;
      },
    },
  };
});
