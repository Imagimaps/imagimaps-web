import { model } from '@modern-js/runtime/model';
import { Map as WorldMap, MapLayer, LayerStatus } from '@shared/_types';
import { UploadStatus } from '@/components/upload-panel';

type LayerId = string;

type LayerEditState = {
  name: boolean;
  description: boolean;
};

type LayerImageUpload = {
  key: string;
  selectedFiles: any[];
  uploadedFiles: any[];
  uploadStatus: UploadStatus;
  uploadProgress: number;
  totalSize: number;
};

type LayerModelState = {
  map?: WorldMap;
  layers: MapLayer[];
  activeLayer?: MapLayer;
  lastCreatedLayer?: MapLayer;
  editState: Map<LayerId, LayerEditState>;
  imageUploads: Map<LayerId, LayerImageUpload>;
  imagesBeingProcessed: Map<LayerId, boolean>;
};

export const LayerModel = model<LayerModelState>('map_layers').define(_ => {
  return {
    state: {
      map: undefined,
      layers: [],
      editState: new Map(),
      imageUploads: new Map(),
      imagesBeingProcessed: new Map(),
    },
    computed: {
      fieldHasChanged:
        (state: LayerModelState) =>
        (field: keyof MapLayer): boolean => {
          const layerId = state.activeLayer?.id;
          if (!layerId) {
            return false;
          }
          const layer = state.layers.find(l => l.id === layerId);
          if (!layer) {
            return false;
          }
          return (
            layer[field] !==
            state.map?.layers.find(l => l.id === layerId)?.[field]
          );
        },
      currentLayerHasChanges: (state: LayerModelState) => {
        const layerId = state.activeLayer?.id;
        if (!layerId) {
          return false;
        }
        const layer = state.layers.find(l => l.id === layerId);
        if (!layer) {
          return false;
        }
        const originalLayer = state.map?.layers.find(l => l.id === layerId);
        if (!originalLayer) {
          console.log('[LayersModel] No original layer found');
          return true;
        }
        return Object.keys(layer).some(k => {
          const hasChange =
            layer[k as keyof MapLayer] !== originalLayer[k as keyof MapLayer];
          console.log(`[LayersModel] Checking ${k} for changes`, hasChange);
          return hasChange;
        });
      },
      changedLayers: (state: LayerModelState) => {
        return state.layers.filter(l => {
          const originalLayer = state.map?.layers.find(_l => _l.id === l.id);
          if (!originalLayer) {
            return true;
          }
          return Object.keys(l).some(
            k => l[k as keyof MapLayer] !== originalLayer[k as keyof MapLayer],
          );
        });
      },
      layerCount: (state: LayerModelState) => {
        return state.layers.length;
      },
      activeLayerIsWorkable: (state: LayerModelState) => {
        return state.activeLayer?.status === LayerStatus.ACTIVE;
      },
      activeLayerIsProcessing: (state: LayerModelState) => {
        const layerId = state.activeLayer?.id;
        const isProcessing = state.imagesBeingProcessed.get(layerId ?? '');
        return isProcessing ?? false;
      },
    },
    actions: {
      initialise: (state: LayerModelState, map: WorldMap) => {
        console.log('[LayersModel] Initialising Layers', map, [...map.layers]);
        state.map = map;
        state.layers = [...map.layers];
        state.activeLayer =
          map.layers.find(l => l.active) ??
          map.layers.find(l => l.isDefault) ??
          map.layers.length > 0
            ? map.layers[0]
            : undefined;
        console.log(
          '[LayersModel] Initialised Layers',
          state.layers,
          state.activeLayer,
        );
      },
      addLayer: (state: LayerModelState, layer: MapLayer) => {
        const index = state.layers.findIndex(l => l.order > layer.order);
        if (index === -1) {
          state.layers.push(layer);
        } else {
          state.layers.splice(index, 0, layer);
        }
      },
      setActiveLayer: (state: LayerModelState, layer: MapLayer) => {
        state.activeLayer = layer;
      },
      saveUpdatedLayer: (state: LayerModelState, updatedLayer: MapLayer) => {
        const layer = state.layers.find(l => l.id === updatedLayer.id);
        if (layer) {
          Object.assign(layer, updatedLayer);
        }
        const originalLayer = state.map?.layers.find(
          l => l.id === updatedLayer.id,
        );
        if (originalLayer) {
          Object.assign(originalLayer, updatedLayer);
        }
      },
      setFieldEditState: (
        state: LayerModelState,
        field: keyof LayerEditState,
        value: boolean,
      ) => {
        const layerId = state.activeLayer?.id;
        if (!layerId) {
          console.error('No active layer to edit');
          return;
        }
        const editState = state.editState.get(layerId) ?? {
          name: false,
          description: false,
        };
        editState[field] = value;
        state.editState.set(layerId, editState);
      },
      resetFieldEditState: (state: LayerModelState) => {
        const layerId = state.activeLayer?.id;
        if (!layerId) {
          console.error('No active layer to edit');
          return;
        }
        state.editState.delete(layerId);
      },
      updateField: (
        state: LayerModelState,
        field: keyof MapLayer,
        value: any,
      ) => {
        const layerId = state.activeLayer?.id;
        if (!layerId) {
          console.error('No active layer to edit');
          return;
        }
        const layer = state.layers.find(l => l.id === layerId);
        if (!layer) {
          console.error('Active layer not found in layers');
          return;
        }
        (layer[field] as any) = value;
      },
      undoEditsToField: (state: LayerModelState, field: keyof MapLayer) => {
        const layerId = state.activeLayer?.id;
        if (!layerId) {
          console.error('No active layer to edit');
          return;
        }
        const layer = state.layers.find(l => l.id === layerId);
        if (!layer) {
          console.error('Active layer not found in layers');
          return;
        }
        const originalValue = state.map?.layers.find(l => l.id === layerId)?.[
          field
        ];
        if (originalValue) {
          (layer[field] as any) = originalValue;
        }
      },
      setImageUploadState: (
        state: LayerModelState,
        imageState: LayerImageUpload,
      ) => {
        const layerId = state.activeLayer?.id;
        if (!layerId) {
          console.error('No active layer to edit');
          return;
        }
        state.imageUploads.set(layerId, imageState);
      },
      replaceLayer: (
        state: LayerModelState,
        oldLayer: MapLayer,
        newLayer: MapLayer,
      ) => {
        const index = state.layers.findIndex(l => l.id === oldLayer.id);
        if (index >= 0) {
          state.layers[index] = newLayer;
        }
      },
      setLayerProcessing: (state: LayerModelState, layerId: string) => {
        state.imagesBeingProcessed.set(layerId, true);
      },
      setLayerProcessed: (state: LayerModelState, layerId: string) => {
        state.imagesBeingProcessed.set(layerId, false);
      },
      deleteLayer: (state: LayerModelState, layerId: string) => {
        const index = state.layers.findIndex(l => l.id === layerId);
        if (index >= 0) {
          state.layers.splice(index, 1);
        }
      },
    },
  };
});
