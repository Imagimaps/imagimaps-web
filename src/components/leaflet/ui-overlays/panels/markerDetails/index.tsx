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
  const [editMarker, setEditMarker] = useState<MapMarker>();
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
      setEditMarker({ ...selectedMarker });
      setEditOverlay(selectedOverlay);
    }
  }, [selectedMarker]);

  useEffect(() => {
    console.log('MarkerDetails: editMarker', editMarker);
    setModelEditted(!equal(editMarker, selectedMarker));
  }, [editMarker, selectedMarker]);

  useEffect(() => {
    console.log('MarkerDetails: editOverlay', editOverlay);
    setOverlayEditted(editOverlay?.id !== selectedOverlay?.id);
  }, [editOverlay, selectedOverlay]);

  const activateEditMode = () => setEditMode(true);
  const saveChanges = () => {
    if (!editMarker || !editOverlay) {
      console.error(
        'Cannot save changes, missing marker or overlay',
        editMarker,
        editOverlay,
      );
      return;
    }

    runtimeActions.overlayInteracted(editOverlay);
    // runtimeActions.templateInteracted(selectedTemplate);
    runtimeActions.markerSelected(editMarker);
    setEditMode(false);

    if (selectedMarkerIsNew) {
      console.log('Creating new marker', editMarker, editOverlay);
      mapActions.addNewMarker(editMarker, editOverlay);
      runtimeActions.markerSelected(editMarker);
      return;
    }
    if (modelEditted) {
      console.log('Saving changes to marker', editMarker);
      mapActions.updateMarker(editMarker);
    }
    if (overlayEditted) {
      console.log('Moving marker to overlay', editOverlay);
      mapActions.moveMarkerToOverlay(editMarker, editOverlay);
    }
  };
  const undoChanges = () => {
    if (selectedMarker) {
      console.log('Undoing changes to marker', selectedMarker);
      setEditMarker({ ...selectedMarker });
    }
    setEditMode(false);
  };

  return editMarker ? (
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
          marker={editMarker}
          editMode={editMode}
          onValueChange={value => {
            editMarker && setEditMarker({ ...editMarker, name: value });
          }}
        />
        <LocationRow
          marker={editMarker}
          editMode={editMode}
          onValueChange={value => {
            editMarker && setEditMarker({ ...editMarker, position: value });
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
          marker={editMarker}
          editMode={editMode}
          onValueChange={value => {
            editMarker &&
              setEditMarker({ ...editMarker, refTemplateid: value });
          }}
        />
        <DetailsRow
          marker={editMarker}
          editMode={editMode}
          onValueChange={value => {
            editMarker && setEditMarker({ ...editMarker, description: value });
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
