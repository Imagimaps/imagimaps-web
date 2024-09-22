import { FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import equal from 'deep-equal';
import useWebSocket from 'react-use-websocket';

// import Info from '@shared/svg/info.svg';

import { MapMarker, Overlay } from '@shared/_types';
import ActionsBar from './components/actionsBar';
import TitleRow from './components/titleRow';
import LocationRow from './components/locationRow';
import OverlayRow from './components/overlayRow';
import DetailsRow from './components/detailsRow';
import HeroArea from './components/heroArea';
import TemplateRow from './components/templateRow';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';

import './index.scss';

const MarkerDetails: FC = () => {
  const [
    {
      runtime: { selectedMarker, selectedMarkerIsNew, lastTouchedOverlay },
      selectedMarkerOverlay,
      templateGroups,
      overlays,
      map,
    },
    actions,
  ] = useModel(EngineDataModel, model => {
    return {
      runtime: model.runtime,
      selectedMarkerOverlay: model.selectedMarkerOverlay,
      templateGroups: model.map.templateGroups ?? [],
      overlays: model.overlays,
      map: model.map,
    };
  });
  const { sendJsonMessage } = useWebSocket(
    `ws://localhost:8082/api/map/${map.id}/ws`,
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [stagedMarkerEdits, setStagedMarkerEdits] = useState<MapMarker>();
  const [modelHasEdits, setModelHasEdits] = useState<boolean>(false);
  const [overlayEdited, setOverlayEdited] = useState<boolean>(false);
  const [targetOverlay, setTargetOverlay] = useState<Overlay>();

  useEffect(() => {
    if (selectedMarkerIsNew) {
      setEditMode(true);
    }
  }, [selectedMarkerIsNew]);

  useEffect(() => {
    console.log(
      'MarkerDetails: selectedMarker',
      selectedMarker,
      selectedMarkerOverlay,
    );
    if (selectedMarker) {
      setStagedMarkerEdits({ ...selectedMarker });
      setTargetOverlay(
        selectedMarkerOverlay ?? lastTouchedOverlay ?? overlays[0],
      );
    }
  }, [selectedMarker, selectedMarkerOverlay]);

  useEffect(() => {
    console.log('MarkerDetails: editMarker', stagedMarkerEdits);
    setModelHasEdits(!equal(stagedMarkerEdits, selectedMarker));
  }, [stagedMarkerEdits, selectedMarker]);

  useEffect(() => {
    console.log('MarkerDetails: targetOverlay', targetOverlay);
    setOverlayEdited(targetOverlay?.id !== selectedMarkerOverlay?.id);
  }, [targetOverlay, selectedMarkerOverlay]);

  const saveChanges = () => {
    if (!stagedMarkerEdits || !targetOverlay) {
      console.error(
        'Cannot save changes, missing marker or overlay',
        stagedMarkerEdits,
        targetOverlay,
      );
      return;
    }

    actions.overlayTouched(targetOverlay);
    // runtimeActions.templateInteracted(selectedTemplate);
    actions.selectMarker(stagedMarkerEdits);
    setEditMode(false);

    if (selectedMarkerIsNew) {
      console.log('Creating new marker', stagedMarkerEdits, targetOverlay);
      actions.createPointMarker(stagedMarkerEdits, targetOverlay);
      actions.selectMarker(stagedMarkerEdits);
      sendJsonMessage({
        type: 'CREATE_MARKER',
        payload: {
          marker: stagedMarkerEdits,
          overlayId: targetOverlay.id,
        },
      });
      return;
    }
    if (modelHasEdits) {
      console.log('Saving changes to marker', stagedMarkerEdits);
      actions.updateMarker(stagedMarkerEdits);
      sendJsonMessage({
        type: 'UPDATE_MARKER',
        payload: {
          marker: stagedMarkerEdits,
        },
      });
    }
    if (overlayEdited) {
      console.log('Moving marker to overlay', targetOverlay);
      actions.moveMarkerToOverlay(stagedMarkerEdits, targetOverlay);
      sendJsonMessage({
        type: 'UPDATE_MARKER_OVERLAY',
        payload: {
          marker: stagedMarkerEdits,
          overlayId: targetOverlay.id,
        },
      });
    }
  };
  const undoChanges = () => {
    if (selectedMarker) {
      console.log('Undoing changes to marker', selectedMarker);
      setStagedMarkerEdits({ ...selectedMarker });
    }
    setEditMode(false);
  };

  const templateFromId = (templateId: string) => {
    return templateGroups
      .map(group => group.markerTemplates)
      .flat()
      .find(template => template.id === templateId);
  };

  return (
    stagedMarkerEdits && (
      <div className="marker-details">
        <HeroArea template={templateFromId(stagedMarkerEdits.templateId)} />
        <div className="marker-details-content">
          <ActionsBar
            editMode={editMode}
            modelHasEdits={modelHasEdits || overlayEdited}
            modelIsNew={selectedMarkerIsNew}
            activateEditMode={() => setEditMode(true)}
            saveChanges={saveChanges}
            undoChanges={undoChanges}
          />
          <TitleRow
            marker={stagedMarkerEdits}
            editMode={editMode}
            onValueChange={value => {
              stagedMarkerEdits &&
                setStagedMarkerEdits({ ...stagedMarkerEdits, name: value });
            }}
          />
          <LocationRow
            marker={stagedMarkerEdits}
            editMode={editMode}
            onValueChange={value => {
              stagedMarkerEdits &&
                setStagedMarkerEdits({ ...stagedMarkerEdits, position: value });
            }}
          />
          <OverlayRow
            overlay={targetOverlay}
            editMode={editMode}
            onValueChange={value => {
              setTargetOverlay(value);
            }}
          />
          <TemplateRow
            marker={stagedMarkerEdits}
            editMode={editMode}
            onValueChange={value => {
              stagedMarkerEdits &&
                setStagedMarkerEdits({
                  ...stagedMarkerEdits,
                  templateId: value,
                });
            }}
          />
          <DetailsRow
            marker={stagedMarkerEdits}
            editMode={editMode}
            onValueChange={value => {
              stagedMarkerEdits &&
                setStagedMarkerEdits({
                  ...stagedMarkerEdits,
                  description: value,
                });
            }}
          />
        </div>
      </div>
    )
  );
};

export default MarkerDetails;
