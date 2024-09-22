import { FC } from 'react';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';

import './styles.scss';

interface ActionsBarProps {
  editMode: boolean;
  modelHasEdits: boolean;
  modelIsNew: boolean;
  activateEditMode?: () => void;
  saveChanges?: () => void;
  undoChanges?: () => void;
}

const ActionsBar: FC<ActionsBarProps> = ({
  editMode,
  modelHasEdits,
  modelIsNew,
  activateEditMode,
  saveChanges,
  undoChanges,
}) => {
  const size = '1.5rem';
  return (
    <div className="details-panel-segment actions-bar">
      {editMode ? (
        <>
          {(modelHasEdits || modelIsNew) && (
            <SaveIconButton
              alt="Save edits made to marker"
              size={size}
              onClick={saveChanges}
            />
          )}
          {!modelIsNew && (
            <UndoIconButton
              alt="Undo edits made to marker"
              size={size}
              onClick={undoChanges}
            />
          )}
        </>
      ) : (
        <EditIconButton
          alt="Edit marker details"
          size={size}
          onClick={activateEditMode}
        />
      )}
    </div>
  );
};

export default ActionsBar;
