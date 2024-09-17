import { FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import equal from 'deep-equal';

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
      runtime: { selectedMarker, selectedTemplate, selectedMarkerIsNew },
      selectedMarkerOverlay,
    },
    runtimeActions,
  ] = useModel(EngineDataModel, model => {
    return {
      runtime: model.runtime,
      selectedMarkerOverlay: model.selectedMarkerOverlay,
    };
  });
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
    // console.log('MarkerDetails: selectedMarker', selectedMarker);
    if (selectedMarker) {
      setStagedMarkerEdits({ ...selectedMarker });
      setTargetOverlay(selectedMarkerOverlay);
    }
  }, [selectedMarker]);

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

    runtimeActions.overlayTouched(targetOverlay);
    // runtimeActions.templateInteracted(selectedTemplate);
    runtimeActions.selectMarker(stagedMarkerEdits);
    setEditMode(false);

    if (selectedMarkerIsNew) {
      console.log('Creating new marker', stagedMarkerEdits, targetOverlay);
      runtimeActions.createPointMarker(stagedMarkerEdits, targetOverlay);
      runtimeActions.selectMarker(stagedMarkerEdits);
      return;
    }
    if (modelHasEdits) {
      console.log('Saving changes to marker', stagedMarkerEdits);
      runtimeActions.updateMarker(stagedMarkerEdits);
    }
    if (overlayEdited) {
      console.log('Moving marker to overlay', targetOverlay);
      runtimeActions.moveMarkerToOverlay(stagedMarkerEdits, targetOverlay);
    }
  };
  const undoChanges = () => {
    if (selectedMarker) {
      console.log('Undoing changes to marker', selectedMarker);
      setStagedMarkerEdits({ ...selectedMarker });
    }
    setEditMode(false);
  };

  // TODO: Template Shenanigans
  return (
    stagedMarkerEdits && (
      <div className="marker-details">
        <HeroArea template={selectedTemplate} />
        {/* <div className="hero-area">
          <img src={Info} />
        </div> */}
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
