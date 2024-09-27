import { FC, useEffect, useMemo, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import useWebSocket from 'react-use-websocket';

// import Info from '@shared/svg/info.svg';

import { Overlay } from '@shared/_types';
import ActionsBar from './components/actionsBar';
import TitleRow from './components/titleRow';
import LocationRow from './components/locationRow';
import OverlayRow from './components/overlayRow';
import DetailsRow from './components/detailsRow';
import HeroArea from './components/heroArea';
import TemplateRow from './components/templateRow';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';
import { StagedDataModel } from '@/components/imagimapper/state/stagedData';
import { useRemoteBackends } from '@/hooks/remoteBackends';

import './index.scss';

const MarkerDetails: FC = () => {
  const { mapApiHost } = useRemoteBackends();

  const [{ lastUsedOverlay }, { overlayUsed }] = useModel(
    UserInteractionsModel,
  );

  const [
    {
      templateGroups,
      overlays,
      map,
      isNew,
      markerHasChanges,
      markerOverlayChanged,
      markerId,
      overlayId,
      templateId,
      mapMarker,
    },
    {
      undoChanges,
      createPointMarker,
      updateMarker,
      moveMarkerToOverlay,
      hydrateFromMapMarker,
    },
  ] = useModel([EngineDataModel, StagedDataModel], (e, s) => ({
    templateGroups: e.map.templateGroups ?? [],
    overlays: e.overlays,
    map: e.map,
    isNew: s.isNew,
    markerHasChanges: s.isChanged,
    markerOverlayChanged: s.overlayIdChanged,
    markerId: s.id?.[2] ?? s.id?.[1],
    overlayId: s.overlayId?.[2] ?? s.overlayId?.[1] ?? e.overlays[0].id,
    templateId: s.templateId?.[2] ?? s.templateId?.[1] ?? e.templates[0].id,
    mapMarker: s.mapMarker,
  }));

  const { sendJsonMessage } = useWebSocket(
    `ws://${mapApiHost}/api/map/${map.id}/ws`,
    {
      share: true,
    },
  );

  const [editMode, setEditMode] = useState<boolean>(false);

  const selectedMarkerOverlay: Overlay = useMemo(() => {
    return (
      overlays.find(o => o.id === overlayId) ??
      overlays.find(o => o.markers.some(m => m.id === markerId)) ??
      lastUsedOverlay ??
      overlays[0]
    );
  }, [markerId, overlays]);

  useEffect(() => {
    console.log('[MarkerDetails] isNew:', isNew);
    if (isNew) {
      console.log('[MarkerDetails] Setting edit mode to true');
      setEditMode(true);
    }
  }, [isNew]);

  const saveChanges = () => {
    if (!(markerHasChanges || isNew)) {
      console.warn(
        '[MarkerDetails] No changes made to marker, not saving',
        mapMarker,
        markerHasChanges,
        isNew,
      );
      return;
    }

    overlayUsed(selectedMarkerOverlay);
    // templateUsed(template);
    setEditMode(false);

    if (isNew) {
      console.log(
        '[MarkerDetails] Creating new marker',
        mapMarker,
        selectedMarkerOverlay,
      );
      createPointMarker(mapMarker, selectedMarkerOverlay);
      sendJsonMessage({
        type: 'CREATE_MARKER',
        payload: {
          marker: mapMarker,
          overlayId: selectedMarkerOverlay.id,
        },
      });
      return;
    }
    if (markerHasChanges) {
      console.log('[MarkerDetails] Saving changes to marker', mapMarker);
      updateMarker(mapMarker);
      hydrateFromMapMarker(mapMarker);
      sendJsonMessage({
        type: 'UPDATE_MARKER',
        payload: {
          marker: mapMarker,
        },
      });
    }
    if (markerOverlayChanged) {
      console.log(
        '[MarkerDetails] Moving marker to overlay',
        selectedMarkerOverlay,
      );
      moveMarkerToOverlay(mapMarker, selectedMarkerOverlay);
      sendJsonMessage({
        type: 'UPDATE_MARKER_OVERLAY',
        payload: {
          marker: mapMarker,
          overlayId: selectedMarkerOverlay.id,
        },
      });
    }
  };

  const templateFromId = (templateId: string) => {
    return templateGroups
      .map(group => group.markerTemplates)
      .flat()
      .find(template => template.id === templateId);
  };

  return (
    mapMarker && (
      <div className="marker-details">
        <HeroArea template={templateFromId(templateId)} />
        <div className="marker-details-content">
          <ActionsBar
            editMode={editMode}
            activateEditMode={() => setEditMode(true)}
            saveChanges={saveChanges}
            undoChanges={() => {
              undoChanges();
              setEditMode(false);
            }}
          />
          <TitleRow editMode={editMode} />
          <LocationRow editMode={editMode} />
          <OverlayRow editMode={editMode} />
          <TemplateRow editMode={editMode} />
          <DetailsRow editMode={editMode} />
        </div>
      </div>
    )
  );
};

export default MarkerDetails;
