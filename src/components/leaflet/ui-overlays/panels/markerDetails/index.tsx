import { FC, useEffect, useState } from 'react';
import { MapMarker, Overlay } from '@shared/_types';
import { useModel, useStaticModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import equal from 'deep-equal';
import HeroArea from './components/heroArea';
import ActionsBar from './components/actionsBar';
import TitleRow from './components/titleRow';
import LocationRow from './components/locationRow';
import OverlayRow from './components/overlayRow';
import TemplateRow from './components/templateRow';
import DetailsRow from './components/detailsRow';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';
import { MapDataModel } from '@/components/leaflet/mapDataModel';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarkerDetailsProps {}

const MarkerDetails: FC<MarkerDetailsProps> = () => {
  const [runtime, runtimeActions] = useModel(MapRuntimeModel);
  const { selectedMarker, selectedTemplate, selectedOverlay } = runtime;
  const { selectedMarkerIsNew } = runtime;

  const [, mapActions] = useStaticModel(MapDataModel);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [stagedMarkerEdits, setStagedMarkerEdits] = useState<MapMarker>();
  const [modelEditted, setModelEditted] = useState<boolean>(false);
  const [overlayEditted, setOverlayEditted] = useState<boolean>(false);
  const [editOverlay, setEditOverlay] = useState<Overlay>();

  useEffect(() => {
    if (selectedMarkerIsNew) {
      setEditMode(true);
    }
  }, [selectedMarkerIsNew]);

  useEffect(() => {
    // console.log('MarkerDetails: selectedMarker', selectedMarker);
    if (selectedMarker) {
      setStagedMarkerEdits({ ...selectedMarker });
      setEditOverlay(selectedOverlay);
    }
  }, [selectedMarker]);

  useEffect(() => {
    console.log('MarkerDetails: editMarker', stagedMarkerEdits);
    setModelEditted(!equal(stagedMarkerEdits, selectedMarker));
  }, [stagedMarkerEdits, selectedMarker]);

  useEffect(() => {
    console.log('MarkerDetails: editOverlay', editOverlay);
    setOverlayEditted(editOverlay?.id !== selectedOverlay?.id);
  }, [editOverlay, selectedOverlay]);

  const activateEditMode = () => setEditMode(true);
  const saveChanges = () => {
    if (!stagedMarkerEdits || !editOverlay) {
      console.error(
        'Cannot save changes, missing marker or overlay',
        stagedMarkerEdits,
        editOverlay,
      );
      return;
    }

    runtimeActions.overlayInteracted(editOverlay);
    // runtimeActions.templateInteracted(selectedTemplate);
    runtimeActions.markerSelected(stagedMarkerEdits);
    setEditMode(false);

    if (selectedMarkerIsNew) {
      console.log('Creating new marker', stagedMarkerEdits, editOverlay);
      mapActions.addNewMarker(stagedMarkerEdits, editOverlay);
      runtimeActions.markerSelected(stagedMarkerEdits);
      return;
    }
    if (modelEditted) {
      console.log('Saving changes to marker', stagedMarkerEdits);
      mapActions.updateMarker(stagedMarkerEdits);
    }
    if (overlayEditted) {
      console.log('Moving marker to overlay', editOverlay);
      mapActions.moveMarkerToOverlay(stagedMarkerEdits, editOverlay);
    }
  };
  const undoChanges = () => {
    if (selectedMarker) {
      console.log('Undoing changes to marker', selectedMarker);
      setStagedMarkerEdits({ ...selectedMarker });
    }
    setEditMode(false);
  };

  return stagedMarkerEdits ? (
    <div>
      <HeroArea template={selectedTemplate} />
      <ContentArea>
        <ActionsBar
          editMode={editMode}
          modelHasEdits={modelEditted || overlayEditted}
          modelIsNew={selectedMarkerIsNew}
          activateEditMode={activateEditMode}
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
          overlay={editOverlay}
          editMode={editMode}
          onValueChange={value => {
            setEditOverlay(value);
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
      </ContentArea>
    </div>
  ) : null;
};

export default MarkerDetails;

const ContentArea = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;
