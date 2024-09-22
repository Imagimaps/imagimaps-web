import { Overlay } from '@shared/_types';
import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import LayersSvg from '@shared/svg/layers.svg';
import { Metadata } from './styles';
import { UndoIconButton } from '@/components/icon/buttons';
import SvgIcon from '@/components/icon/svg';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';

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
  const [{ overlays, selectedMarkerOverlay }] = useModel(EngineDataModel);

  const [updatedOverlay, setUpdatedOverlay] = useState<Overlay>();
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    if (overlay) {
      setUpdatedOverlay(overlay);
    }
  }, [overlay]);

  useEffect(() => {
    if (updatedOverlay) {
      const hasChanges = updatedOverlay?.id !== selectedMarkerOverlay?.id;
      setLocalChanges(hasChanges);
      onValueChange?.(updatedOverlay);
    }
  }, [updatedOverlay, selectedMarkerOverlay]);

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
        selectedMarkerOverlay && setOverlayById(selectedMarkerOverlay.id);
        break;
      default:
        console.log('OverlayRow: Unknown Key', e.key);
        break;
    }
  };

  console.log('OverlayRow: selectedOverlay', selectedMarkerOverlay, overlays);

  return (
    <div className="details-panel-row">
      <div className="detail-item">
        <SvgIcon className="meta-icon" src={LayersSvg} alt="" />
        {editMode ? (
          <>
            <select
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
            </select>
          </>
        ) : (
          <Metadata>{updatedOverlay?.name}</Metadata>
        )}
      </div>
      <div className="controls">
        {localChanges && (
          <UndoIconButton
            alt="Undo changes made to assigned overlay"
            onClick={() =>
              selectedMarkerOverlay && setOverlayById(selectedMarkerOverlay.id)
            }
          />
        )}
      </div>
    </div>
  );
};

export default OverlayRow;
