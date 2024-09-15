import { FC, useEffect, useState } from 'react';
import { Panel } from 'primereact/panel';
import { useModel } from '@modern-js/runtime/model';

import { post as CreateLayer } from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]/layer';
import UploadsPanel from '@components/upload-panel';
import { MapLayer } from '@shared/_types';
import { AppModel } from '@/state/appModel';

import './index.scss';

type NewMapLayerProps = {
  model?: MapLayer;
  onModelChange?: (model: MapLayer) => void;
  onLayerCreated?: (layer: MapLayer) => void;
};

const NewMapLayer: FC<NewMapLayerProps> = ({
  model,
  onModelChange,
  onLayerCreated,
}) => {
  const [{ activeWorld, activeMap, community }] = useModel(AppModel);
  const [triggerUpload, setTriggerUpload] = useState(false);
  const [layer, setLayer] = useState<MapLayer | undefined>(model);

  useEffect(() => {
    setLayer(model);
  }, [model]);

  useEffect(() => {
    if (layer) {
      onModelChange?.(layer);
    }
  }, [layer]);

  const beginFileUpload = (event: any) => {
    event.preventDefault();
    console.log('Submit New Map Layer', layer);
    if (!layer?.name) {
      console.error('Layer name is required');
      return;
    }
    setTriggerUpload(true);
  };

  const createNewLayer = async (uploadKey: string) => {
    console.log('Create New Layer', layer);
    setTriggerUpload(false);
    if (!layer || !community || !activeWorld || !activeMap) {
      console.error('Not enough context to create layer');
      return;
    }
    const newLayer = await CreateLayer(
      community?.id,
      activeWorld?.id,
      activeMap?.id,
      {
        query: undefined,
        data: { uploadKey, layer },
      },
    );
    onLayerCreated?.(newLayer);
  };

  if (!layer) {
    return (
      <Panel className="new-map-layer">
        <p>🚫</p>
      </Panel>
    );
  }

  return (
    <Panel className="new-map-layer">
      <h2>Add New Map Layer</h2>
      <form className="new-item-details">
        <div className="form-row">
          <label htmlFor="layer-name">Name</label>
          <input
            type="text"
            id="layer-name"
            name="layer-name"
            placeholder="Layer Name"
            value={layer.name}
            onChange={event => setLayer({ ...layer, name: event.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="layer-description">Description</label>
          <textarea
            id="layer-description"
            name="layer-description"
            placeholder="Layer Description"
            value={layer.description}
            onChange={event =>
              setLayer({ ...layer, description: event.target.value })
            }
          />
        </div>
        <h3>Layer Parameters</h3>
        <div className="form-row">
          <p>Position Offset</p>
          <div className="input-pair">
            <div className="input-label-group">
              <label htmlFor="origin-offset-x">X</label>
              <input
                type="number"
                id="origin-offset-x"
                name="origin-offset-x"
                placeholder="X Offset"
                value={layer.topography.position.x}
                onChange={event => {
                  layer.topography.position.x = Number(event.target.value);
                  setLayer({ ...layer });
                }}
              />
            </div>
            <div className="input-label-group">
              <label htmlFor="origin-offset-y">Y</label>
              <input
                type="number"
                id="origin-offset-y"
                name="origin-offset-y"
                placeholder="Y Offset"
                value={layer.topography.position.y}
                onChange={event => {
                  layer.topography.position.y = Number(event.target.value);
                  setLayer({ ...layer });
                }}
              />
            </div>
          </div>
        </div>
        <div className="form-row">
          <p>Scale</p>
          <div className="input-pair">
            <div className="input-label-group">
              <label htmlFor="scale-x">X</label>
              <input
                type="number"
                id="scale-x"
                name="scale-x"
                placeholder="X Scale"
                value={layer.topography.scale.x}
                onChange={event => {
                  layer.topography.scale.x = Number(event.target.value);
                  setLayer({ ...layer });
                }}
              />
            </div>
            <div className="input-label-group">
              <label htmlFor="scale-y">Y</label>
              <input
                type="number"
                id="scale-y"
                name="scale-y"
                placeholder="Y Scale"
                value={layer.topography.scale.y}
                onChange={event => {
                  layer.topography.scale.y = Number(event.target.value);
                  setLayer({ ...layer });
                }}
              />
            </div>
          </div>
        </div>
      </form>
      <UploadsPanel
        triggerUpload={triggerUpload}
        onUploadComplete={createNewLayer}
        onUploadError={() => setTriggerUpload(false)}
      />
      <button
        className="new-layer-submit"
        type="submit"
        // onClick={createNewLayer}
        onClick={beginFileUpload}
      >
        Add Layer
      </button>
    </Panel>
  );
};

export default NewMapLayer;
