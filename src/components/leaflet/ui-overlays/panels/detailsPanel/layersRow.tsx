import { ChangeEventHandler, FC, useEffect, useState } from 'react';

import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import LayersSvg from '@shared/svg/layers.svg';
import { MapOverlay } from '@shared/_types';
import {
  ActionButtonContainer,
  ContentRow,
  Metadata,
  metaDataIconStyle,
} from './styles';
import { MapDataModel } from '@/components/leaflet/mapDataModel';
import SvgIcon from '@/components/icon/svg';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';

interface LayersRowProps {
  activeOverlay?: MapOverlay;
  openEditable?: boolean;
  onEditing?: (propName: string, isEditing: boolean) => void;
  onSave?: (overlay: MapOverlay) => void;
  onCancel?: (propName: string) => void;
}

const LayersRow: FC<LayersRowProps> = ({
  activeOverlay,
  openEditable = false,
  onEditing,
  onSave,
  onCancel,
}) => {
  const propName = 'overlay';
  console.log(
    'Overlay should start in edit mode',
    openEditable,
    'with overlay',
    activeOverlay,
  );

  const [showEdit, setShowEdit] = useState(!openEditable);
  const [isEditing, setIsEditing] = useState(openEditable);
  const [selectedOverlay, setSelectedOverlay] = useState<MapOverlay>();

  const [mapData] = useModel(MapDataModel, model => ({
    overlays: model.map.topology.overlays,
  }));

  useEffect(() => {
    if (activeOverlay) {
      setSelectedOverlay(activeOverlay);
    }
    if (isEditing) {
      setIsEditing(openEditable);
    }
  }, [activeOverlay]);

  useEffect(() => {
    onEditing?.(propName, isEditing);
  }, [isEditing]);

  const overlaySelected: ChangeEventHandler<HTMLSelectElement> = e => {
    const selectedOverlayId = e.target.value;
    const targetOverlay = mapData.overlays.find(
      overlay => overlay.id === selectedOverlayId,
    );
    if (targetOverlay) {
      setSelectedOverlay(targetOverlay);
    }
  };

  const save = () => {
    if (selectedOverlay) {
      onSave?.(selectedOverlay);
    }
    setIsEditing(false);
  };

  const edit = () => {
    setIsEditing(true);
    setShowEdit(false);
  };

  const cancel = () => {
    setSelectedOverlay(activeOverlay);
    setIsEditing(false);
    onCancel?.(propName);
  };

  return (
    <ContentRow
      as="div"
      onMouseOver={() => !isEditing && setShowEdit(true)}
      onMouseOut={() => setShowEdit(false)}
    >
      <SvgIcon src={LayersSvg} alt="" style={metaDataIconStyle} />
      {isEditing ? (
        <>
          <OverlaySelect
            as="select"
            id="select-overlay"
            defaultValue={selectedOverlay?.id}
            onChange={overlaySelected}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                save();
              } else if (e.key === 'Escape') {
                cancel();
              }
            }}
          >
            {mapData.overlays.map(overlay => (
              <option key={overlay.id} value={overlay.id}>
                {overlay.name}
              </option>
            ))}
          </OverlaySelect>
          <ActionButtonContainer>
            <SaveIconButton
              alt="Save changes to overlay assignment"
              onClick={save}
            />
            <UndoIconButton
              alt="Undo changes to overlay assignment"
              onClick={cancel}
            />
          </ActionButtonContainer>
        </>
      ) : (
        <Metadata>{selectedOverlay?.name}</Metadata>
      )}

      {showEdit && (
        <EditIconButton alt="Edit Overlay Assignment" onClick={edit} />
      )}
    </ContentRow>
  );
};

export default LayersRow;

const OverlaySelect = styled.select``;
