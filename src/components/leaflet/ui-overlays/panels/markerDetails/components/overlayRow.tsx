import styled from '@modern-js/runtime/styled';
import { Overlay } from '@shared/_types';
import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import LayersSvg from '@shared/svg/layers.svg';
import { Metadata } from '../../detailsPanel/styles';
import { UndoIconButton } from '@/components/icon/buttons';
import { MapDataModel } from '@/components/leaflet/mapDataModel';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';
import SvgIcon from '@/components/icon/svg';

interface OverlayRowProps<T> {
  overlay?: Overlay;
  editMode: boolean;
  onValueChange?: (value: T) => void;
}

const OverlayRow: FC<OverlayRowProps<Overlay>> = ({
  overlay,
  editMode,
  onValueChange,
}) => {
  const [overlays] = useModel(MapDataModel, model => model.overlays);
  const [selectedOverlay] = useModel(MapRuntimeModel, m => m.selectedOverlay);

  const [updatedOverlay, setUpdatedOverlay] = useState<Overlay>();
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    if (overlay) {
      setUpdatedOverlay(overlay);
    }
  }, [overlay]);

  useEffect(() => {
    if (updatedOverlay) {
      const hasChanges = updatedOverlay?.id !== selectedOverlay?.id;
      setLocalChanges(hasChanges);
      onValueChange?.(updatedOverlay);
    }
  }, [updatedOverlay, selectedOverlay]);

  const findOverlay = (overlayId: string) => {
    return overlays.find(overlay => overlay.id === overlayId);
  };

  const setOverlayById = (overlayId: string) => {
    const targetOverlay = findOverlay(overlayId);
    if (targetOverlay) {
      setUpdatedOverlay(targetOverlay);
    }
  };

  const overlaySelected: ChangeEventHandler<HTMLSelectElement> = e => {
    setOverlayById(e.target.value);
  };

  const processKeyPress = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    switch (e.key) {
      case 'Enter':
        console.log('OverlayRow: Enter pressed');
        break;
      case 'Escape':
        selectedOverlay && setOverlayById(selectedOverlay.id);
        break;
      default:
        console.log('OverlayRow: Unknown Key', e.key);
        break;
    }
  };

  return (
    <Row>
      <Content>
        <MetaIcon src={LayersSvg} alt="" />
        {editMode ? (
          <>
            <OverlaySelect
              as="select"
              id="select-overlay"
              value={updatedOverlay?.id}
              onChange={overlaySelected}
              onKeyDown={processKeyPress}
            >
              {overlays.map(overlay => (
                <option key={overlay.id} value={overlay.id}>
                  {overlay.name}
                </option>
              ))}
            </OverlaySelect>
          </>
        ) : (
          <Metadata>{updatedOverlay?.name}</Metadata>
        )}
      </Content>
      <Controls>
        {localChanges && (
          <UndoIconButton
            alt="Undo changes made to assigned overlay"
            onClick={() =>
              selectedOverlay && setOverlayById(selectedOverlay.id)
            }
          />
        )}
      </Controls>
    </Row>
  );
};

export default OverlayRow;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const OverlaySelect = styled.select``;

const MetaIcon = styled(SvgIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;
