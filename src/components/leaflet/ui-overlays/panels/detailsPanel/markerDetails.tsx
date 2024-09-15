import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import { FC, useEffect, useState } from 'react';
import { DisplayTemplate, MapMarker, Overlay } from '@shared/_types';
import LayersRow from './layersRow';
import NameRow from './nameRow';
import PointLocationRow from './pointLocationRow';
import TypeRow from './typeRow';
import { MapDataModel } from '@/components/leaflet/mapDataModel';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarkerDetailsProps {}

const MarkerDetails: FC<MarkerDetailsProps> = () => {
  const [runtime, runtimeActions] = useModel(MapRuntimeModel);
  const [mapData, mapActions] = useModel(MapDataModel);
  const {
    selectedMarker,
    selectedTemplate,
    selectedOverlay,
    stagedMarker,
    lastUsedTemplate,
    lastUsedOverlay,
  } = runtime;

  const [editModel, setEditModel] = useState<MapMarker>();
  const [activeTemplate, setActiveTemplate] = useState<DisplayTemplate>();
  const [activeOverlay, setActiveOverlay] = useState<Overlay>();
  const [isNewMarker, setIsNewMarker] = useState(false);

  const resetState = () => {
    setEditModel(undefined);
    setActiveTemplate(undefined);
    setActiveOverlay(undefined);
    setIsNewMarker(false);
  };

  useEffect(() => {
    if (selectedMarker) {
      // console.log('Display mode: Existing Selected Marker');
      setEditModel({ ...selectedMarker });
      setActiveTemplate(selectedTemplate);
      setActiveOverlay(selectedOverlay);
      setIsNewMarker(false);
    }

    return resetState;
  }, [selectedMarker, selectedTemplate, selectedOverlay]);

  useEffect(() => {
    setIsNewMarker(false);

    if (stagedMarker) {
      // console.log('Display mode: New Marker');
      setIsNewMarker(true);

      // TODO: Validate all fields before setting editModel
      // Validate last selected overlay still exists
      const lastValidOverlay = mapData.overlays.find(
        overlay => overlay.id === lastUsedOverlay?.id,
      );
      if (lastValidOverlay) {
        setActiveOverlay(lastValidOverlay);
      } else {
        setActiveOverlay(mapData.overlays[0]);
      }

      // const lastValidTemplate = (mapData.map.templateGroups ?? [])
      //   .flatMap(tg => tg.templates)
      //   .find(template => template.id === lastUsedTemplate?.id);

      setEditModel({ ...stagedMarker } as MapMarker);
      setActiveTemplate(lastUsedTemplate);
    }

    return resetState;
  }, [stagedMarker]);

  const editStateChange = (propName: string, isEditing: boolean) => {
    // TODO: Show keyboard shortcuts for editing
    console.log('Edit State Change', propName, isEditing);
  };

  const save = (_propName: string) => {
    // console.log('MarkerDetails save', isNewMarker, selectedMarker, editModel);
    if (isNewMarker) {
      // TODO: Add new marker
    } else {
      console.log('committing changes', selectedMarker, editModel);
      const toSave = Object.assign(selectedMarker ?? {}, editModel);
      mapActions.updateMarker(toSave);
      activeOverlay && runtimeActions.overlayInteracted(activeOverlay);
    }
  };

  const saveOverlay = (overlay: Overlay) => {
    // console.log('saveOverlay', overlay);
    runtimeActions.overlayInteracted(overlay);
    mapActions.moveMarkerToOverlay(editModel!, overlay);
  };

  return editModel ? (
    <>
      <PreviewPane>
        <PreviewImg
          as="img"
          src={activeTemplate?.imgSrc}
          width={activeTemplate?.maxSize.width}
          height={activeTemplate?.maxSize.height}
        />
      </PreviewPane>
      <ContentArea>
        <NameRow
          marker={editModel}
          openEditable={isNewMarker}
          onEditing={editStateChange}
          onSave={save}
        />
        <PointLocationRow
          marker={editModel}
          openEditable={isNewMarker}
          onEditing={editStateChange}
          onSave={save}
        />
        <LayersRow
          activeOverlay={activeOverlay}
          openEditable={isNewMarker}
          onEditing={editStateChange}
          onSave={saveOverlay}
        />
        <TypeRow />
        <Description>{editModel?.description}</Description>
      </ContentArea>
    </>
  ) : (
    <p>Marker Loading...</p>
  );
};

export default MarkerDetails;

const PreviewPane = styled.div`
  display: relative;
  display: flex;
  height: 200px;
  width: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyNjkiPjwvcmVjdD4KPGcgZmlsbD0iIzY0OTRiNyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMSIgeT0iMjAiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxIiB5PSI0MCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEiIHk9IjYwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMSIgeT0iODAiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMTAwIiB4PSIyMCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMDAiIHg9IjQwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEwMCIgeD0iNjAiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMTAwIiB4PSI4MCI+PC9yZWN0Pgo8L2c+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZT0iI2ZmZiI+PC9yZWN0Pgo8L3N2Zz4=');
  background-color: rgba(255, 255, 255, 0.5);
  background-blend-mode: multiply;
`;

const PreviewImg = styled.img`
  display: block;
  margin: auto;
`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.25rem;
`;
