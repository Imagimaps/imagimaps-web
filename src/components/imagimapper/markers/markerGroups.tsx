import { useModel } from '@modern-js/runtime/model';
import { FC, useEffect } from 'react';
import { LayerGroup, Marker } from 'react-leaflet';
import { MapMarker } from '@shared/_types';
import { EngineDataModel } from '../state/engineData';
import { xy } from '../_coordTranslators';

const MarkerGroups: FC = () => {
  const [{ overlays }, actions] = useModel(EngineDataModel, data => ({
    overlays: data.overlays,
  }));

  useEffect(() => {
    console.log('Marker Groups', overlays);
  }, [overlays]);

  const handleClick = (marker: MapMarker) => (_e: any) => {
    console.log('Marker clicked', marker);
    actions.selectMarker(marker);
  };

  return (
    <LayerGroup>
      {overlays.map(overlay => {
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
