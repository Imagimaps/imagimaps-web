import { FC, useEffect, useState } from 'react';
import { Panel } from 'primereact/panel';

import { MapLayer } from '@shared/_types';

import './index.scss';

type MapLayerDetailsProps = {
  model?: MapLayer;
  onModelChange?: (model: MapLayer) => void;
};

const MapLayerDetails: FC<MapLayerDetailsProps> = ({
  model,
  onModelChange,
}) => {
  const [layer, setLayer] = useState<MapLayer | undefined>(model);

  useEffect(() => {
    setLayer(model);
  }, [model]);

  useEffect(() => {
    if (layer) {
      onModelChange?.(layer);
    }
  }, [layer]);

  // const updateLayer = (event: any) => {
  //   event.preventDefault();
  //   console.log('Update Map Layer', layer);
  //   setLayer(layer);
  // };

  return (
    <Panel
      className="map-layer-details-panel"
      header={layer ? layer.name : 'No Layer Selected'}
    >
      {layer ? (
        <div className="map-layer-details">
          <p>Id: {layer.id}</p>
          <p>Status: TODO</p>
          <p>{layer.description}</p>
          <p>Parameters:</p>
          <ul>
            <li>
              Position: {layer.topography.position.x},{' '}
              {layer.topography.position.y}
            </li>
            <li>
              Scale: {layer.topography.scale.x}, {layer.topography.scale.y}
            </li>
          </ul>
          <div>
            <img src={layer.imagePath} alt={layer.name} />
          </div>
        </div>
      ) : (
        <div>
          <p>Select a layer to view details</p>
        </div>
      )}
    </Panel>
  );
};

export default MapLayerDetails;
