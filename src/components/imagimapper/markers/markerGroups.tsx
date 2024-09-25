import { useModel } from '@modern-js/runtime/model';
import { FC } from 'react';
import { LayerGroup, Marker, useMapEvents } from 'react-leaflet';
import { MapMarker } from '@shared/_types';
import { EngineDataModel } from '../state/engineData';
import { xy } from '../_coordTranslators';
import { StagedDataModel } from '../state/stagedData';

const MarkerGroups: FC = () => {
  const [{ overlays, stagedMarkerId }, { selectMarker }] = useModel(
    [EngineDataModel, StagedDataModel],
    (e, s) => ({
      overlays: e.overlays,
      stagedMarkerId: s.id?.[2] ?? s.id?.[1],
    }),
    (_, s) => ({
      selectMarker: s.hydrateFromMapMarker,
    }),
  );
  const map = useMapEvents({});

  const handleClick = (marker: MapMarker) => (_e: any) => {
    console.log('Marker clicked', marker);
    selectMarker(marker);
    map.flyTo(xy(marker.position.x, marker.position.y));
  };

  return (
    <LayerGroup>
      {overlays.map(overlay => {
        return overlay.markers.map(marker => {
          const { position, id } = marker;
          const markerPos = xy(position.x, position.y);
          return (
            id !== stagedMarkerId && (
              <Marker
                key={id}
                position={markerPos}
                riseOnHover={true}
                eventHandlers={{
                  click: handleClick(marker),
                }}
              />
            )
          );
        });
      })}
    </LayerGroup>
  );
};

export default MarkerGroups;
