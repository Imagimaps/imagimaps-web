import { FC } from 'react';
import L from 'leaflet';
import { LayerGroup, Marker, useMapEvents } from 'react-leaflet';
import { useModel } from '@modern-js/runtime/model';

import { MapMarker } from '@shared/_types';
import { EngineDataModel } from '../state/engineData';
import { xy } from '../_coordTranslators';
import { StagedDataModel } from '../state/stagedData';

const MarkerGroups: FC = () => {
  const [{ overlays, templates, stagedMarkerId }, { selectMarker }] = useModel(
    [EngineDataModel, StagedDataModel],
    (e, s) => ({
      overlays: e.overlays,
      templates: e.templates,
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

  const generateIcon = (templateId: string) => {
    // TODO: Save icons in local cache (templateId --> iconObject)
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.warn(
        '[MarkerGroup] Could not generate map marker icon. Template Id refers to non-existent template',
        templateId,
      );
      return L.Marker.prototype.options.icon;
    }
    // console.log('[MarkerGroup] Generating icon for template', template);
    return L.icon({
      iconUrl: `https://cdn.dev.imagimaps.com/${template.iconLink}`,
      iconSize: [24, 24],
    });
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
                icon={generateIcon(marker.templateId)}
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
