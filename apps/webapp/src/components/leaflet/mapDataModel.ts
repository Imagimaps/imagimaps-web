import { Map, MapMarker, MapMetadata, MapOverlay } from '@shared/_types';
import { DefaultMap } from '@shared/_defaults';
import { model } from '@modern-js/runtime/model';

export type MapData = {
  map: Map;
  defaultConfig: MapMetadata;
  userConfig?: Partial<MapMetadata>;
};

export const MapDataDefault: MapData = {
  map: DefaultMap,
  defaultConfig: {
    activeTopologyId: DefaultMap.topology.id,
    viewPosition: DefaultMap.topology.position,
    viewZoom: 1,
  },
};

export const MapDataModel = model('mapData').define(_ => {
  return {
    state: MapDataDefault,
    computed: {
      activeTopology: (state: MapData) => {
        return state.map.topology;
      },
      overlays: (state: MapData) => {
        return state.map.topology.overlays;
      },
    },
    actions: {
      setMap: (state: MapData, map: Map) => {
        state.map = map;
      },
      setDefaultConfig: (state: MapData, config: MapMetadata) => {
        state.defaultConfig = config;
      },
      setUserConfig: (state: MapData, config: Partial<MapMetadata>) => {
        state.userConfig = config;
      },
      updateMarker: (state: MapData, marker: MapMarker) => {
        const overlayIndex = state.map.topology.overlays.findIndex(overlay =>
          overlay.markers.some(m => m.id === marker.id),
        );
        if (overlayIndex >= 0) {
          const overlay = state.map.topology.overlays[overlayIndex];
          const index = overlay.markers.findIndex(m => m.id === marker.id);
          overlay.markers[index] = marker;
          state.map.topology.overlays[overlayIndex] = { ...overlay };
          console.log(
            'Overlay after marker update',
            state.map.topology.overlays[overlayIndex],
          );
        }
      },
      moveMarkerToOverlay: (
        state: MapData,
        marker: MapMarker,
        targetOverlay: MapOverlay,
      ) => {
        const targetOverlayIndex = state.map.topology.overlays.findIndex(
          overlay => overlay.id === targetOverlay.id,
        );
        const overlayIndex = state.map.topology.overlays.findIndex(overlay =>
          overlay.markers.some(m => m.id === marker.id),
        );
        if (overlayIndex >= 0) {
          const overlay = state.map.topology.overlays[overlayIndex];
          const index = overlay.markers.findIndex(m => m.id === marker.id);
          overlay.markers.splice(index, 1);
          state.map.topology.overlays[overlayIndex] = { ...overlay };
        }
        if (targetOverlayIndex >= 0) {
          targetOverlay.markers.push(marker);
          state.map.topology.overlays[targetOverlayIndex] = {
            ...targetOverlay,
          };
        }
      },
      addNewMarker: (
        state: MapData,
        marker: MapMarker,
        overlay: MapOverlay,
      ) => {
        const overlayIndex = state.map.topology.overlays.findIndex(
          o => o.id === overlay.id,
        );
        if (overlayIndex >= 0) {
          state.map.topology.overlays[overlayIndex].markers.push(marker);
        }
      },
    },
  };
});
