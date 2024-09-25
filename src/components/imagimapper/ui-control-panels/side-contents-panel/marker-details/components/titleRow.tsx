import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { UndoIconButton } from '@/components/icon/buttons';

import './styles.scss';
import { StagedDataModel } from '@/components/imagimapper/state/stagedData';

interface TitleRowProps {
  editMode: boolean;
}

const TitleRow: FC<TitleRowProps> = ({ editMode }) => {
  const [{ markerName, nameChanged }, { setName, undoNameChange }] = useModel(
    StagedDataModel,
    m => ({
      markerName: m.name?.[2] ?? m.name?.[1] ?? '',
      nameChanged: m.name?.[0] ?? false,
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
