import { useModel } from '@modern-js/runtime/model';
import { FC, useEffect } from 'react';
import { LayerGroup, Marker } from 'react-leaflet';
import { MapMarker } from '@shared/_types';
import { MapDataModel } from './mapDataModel';
import { xy } from './mapView';
import { MapRuntimeModel } from './mapRuntimeModel';

const MarkerGroups: FC = () => {
  const [mapData] = useModel(MapDataModel, data => ({
    overlays: data.overlays,
    templateGroups: data.map.templateGroups,
  }));
  const [, runtimeActions] = useModel(
    MapRuntimeModel,
    () => null,
    actions => actions,
  );

  useEffect(() => {
    console.log('Marker Groups', mapData.overlays);
  }, [mapData.overlays]);

  const handleClick = (marker: MapMarker) => (_e: any) => {
    console.log('Marker clicked', marker);
    runtimeActions.markerSelected(marker);
  };

  return (
    <LayerGroup>
      {mapData.overlays.map(overlay => {
        return overlay.markers.map(marker => {
          const { position, id } = marker;
          const markerPos = xy(position.x, position.y);
          return (
            <Marker
              key={id}
              position={markerPos}
              riseOnHover={true}
              eventHandlers={{
                click: handleClick(marker),
              }}
            />
          );
        });
      })}
    </LayerGroup>
  );
};

export default MarkerGroups;
