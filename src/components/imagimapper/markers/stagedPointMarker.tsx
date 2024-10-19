import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import L from 'leaflet';
import { Marker } from 'react-leaflet';

import { xy } from '../_coordTranslators';
import { StagedPointMarkerModel } from '../state/stagedPointMarker';
import { EngineDataModel } from '../state/engineData';

const StagedMarker: FC = () => {
  const [{ markerPosition, markerTemplateId, templates }] = useModel(
    [StagedPointMarkerModel, EngineDataModel],
    (s, e) => ({
      markerPosition: s.position?.[1],
      markerTemplateId: s.templateId?.[1],
      mapMarker: s.mapMarker,
      templates: e.templates,
    }),
  );

  const generateIcon = (templateId?: string) => {
    // TODO: Save icons in local cache (templateId --> iconObject)
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.warn(
        '[MarkerGroup] Could not generate map marker icon. Template Id refers to non-existent template',
        templateId,
      );
      return L.Marker.prototype.options.icon;
    }
    return L.icon({
      iconUrl: `https://cdn.dev.imagimaps.com/${template.iconLink}`,
      iconSize: [24, 24],
    });
  };

  return markerPosition ? (
    <Marker
      position={xy(markerPosition.x, markerPosition.y)}
      riseOnHover={true}
      icon={generateIcon(markerTemplateId)}
    />
  ) : null;
};

export default StagedMarker;
