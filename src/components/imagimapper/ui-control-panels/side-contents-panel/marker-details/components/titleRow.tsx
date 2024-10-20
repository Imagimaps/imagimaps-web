import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { UndoIconButton } from '@/components/icon/buttons';

import './styles.scss';
import { StagedPointMarkerModel } from '@/components/imagimapper/state/stagedPointMarker';

interface TitleRowProps {
  editMode: boolean;
}

const TitleRow: FC<TitleRowProps> = ({ editMode }) => {
  const [{ markerName, nameChanged }, { setName, undoNameChange }] = useModel(
    StagedPointMarkerModel,
    m => ({
      markerName: m.name,
      nameChanged: m.nameChanged,
    }),
  );

  const processKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.currentTarget.blur();
        break;
      case 'Escape':
        undoNameChange();
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <div className="details-panel-row">
      <div className="detail-item">
        {editMode ? (
          <input
            className="h1-edit"
            type="text"
            autoFocus={true}
            value={markerName}
            onFocus={e => e.target.select()}
            onChange={e => setName(e.target.value)}
            onKeyDown={processKeyPress}
          />
        ) : (
          <h1>{markerName}</h1>
        )}
      </div>
      <div className="controls">
        {nameChanged && (
          <UndoIconButton
            alt="Undo edits made to name"
            onClick={undoNameChange}
          />
        )}
      </div>
    </div>
  );
};

export default TitleRow;
