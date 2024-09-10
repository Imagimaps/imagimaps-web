import { FC, useEffect, useState } from 'react';
import { Panel } from 'primereact/panel';

import UploadsPanel from '@components/upload-panel';
import { MapLayer } from '@shared/types/map';

import './index.scss';

type NewMapLayerProps = {
  model?: MapLayer;
  onModelChange?: (model: MapLayer) => void;
  onLayerCreated?: () => void;
};

const NewMapLayer: FC<NewMapLayerProps> = ({
  model,
  onModelChange,
  onLayerCreated,
}) => {
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

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('Submit New Map Layer', layer);
    if (!layer?.name) {
      console.error('Layer name is required');
      return;
    }
    setTriggerUpload(true);
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
                defaultValue={0}
                value={layer.parameters.position.x}
                onChange={event => {
                  layer.parameters.position.x = Number(event.target.value);
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
                defaultValue={0}
                value={layer.parameters.position.y}
                onChange={event => {
                  layer.parameters.position.y = Number(event.target.value);
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
                defaultValue={1}
                value={layer.parameters.scale.x}
                onChange={event => {
                  layer.parameters.scale.x = Number(event.target.value);
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
                defaultValue={1}
                value={layer.parameters.scale.y}
                onChange={event => {
                  layer.parameters.scale.y = Number(event.target.value);
                  setLayer({ ...layer });
                }}
              />
            </div>
          </div>
        </div>
      </form>
      <UploadsPanel
        triggerUpload={triggerUpload}
        onUploadComplete={() => {
          setTriggerUpload(false);
          onLayerCreated?.();
        }}
        onUploadError={() => setTriggerUpload(false)}
      />
      <button className="new-layer-submit" type="submit" onClick={handleSubmit}>
        Add Layer
      </button>
    </Panel>
  );
};

export default NewMapLayer;
