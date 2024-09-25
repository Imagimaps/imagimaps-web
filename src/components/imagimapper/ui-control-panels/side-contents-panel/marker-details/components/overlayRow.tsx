import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import LayersSvg from '@shared/svg/layers.svg';
import { Metadata } from './styles';
import { UndoIconButton } from '@/components/icon/buttons';
import SvgIcon from '@/components/icon/svg';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { StagedDataModel } from '@/components/imagimapper/state/stagedData';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';

interface OverlayRowProps {
  editMode: boolean;
}

const OverlayRow: FC<OverlayRowProps> = ({ editMode }) => {
  const [
    { overlayId, overlayChanged, overlays },
    { setOverlayId, undoOverlayChange, overlayUsed },
  ] = useModel(
    [StagedDataModel, UserInteractionsModel, EngineDataModel],
    (s, _, e) => ({
      overlayId: s.overlayId?.[2] ?? s.overlayId?.[1] ?? '',
      overlayChanged: s.overlayId?.[0] ?? false,
      overlays: e.overlays,
    }),
  );

  const findOverlay = (overlayId: string) => {
    return overlays.find(overlay => overlay.id === overlayId);
  };

  const processKeyPress = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    switch (e.key) {
      case 'Enter':
        console.log('OverlayRow: Enter pressed');
        break;
      case 'Escape':
        undoOverlayChange();
        break;
      default:
        console.log('OverlayRow: Unknown Key', e.key);
        break;
    }
  };

  return (
    <div className="details-panel-row">
      <div className="detail-item">
        <SvgIcon className="meta-icon" src={LayersSvg} alt="" />
        {editMode ? (
          <>
            <select
              id="select-overlay"
              value={overlayId}
              onChange={e => {
                setOverlayId(e.target.value);
                overlayUsed(findOverlay(e.target.value));
              }}
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
          <Metadata>{findOverlay(overlayId)?.name}</Metadata>
        )}
      </div>
      <div className="controls">
        {overlayChanged && (
          <UndoIconButton
            alt="Undo changes made to assigned overlay"
            onClick={undoOverlayChange}
          />
        )}
      </div>
    </div>
  );
};

export default OverlayRow;
