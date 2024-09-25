import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';
import { StagedDataModel } from '@/components/imagimapper/state/stagedData';

import './styles.scss';

interface ActionsBarProps {
  editMode: boolean;
  activateEditMode?: () => void;
  saveChanges?: () => void;
  undoChanges?: () => void;
}

const ActionsBar: FC<ActionsBarProps> = ({
  editMode,
  activateEditMode,
  saveChanges,
  undoChanges,
}) => {
  const [{ isNew, isChanged }] = useModel(StagedDataModel);
  const size = '1.5rem';
  return (
    <div className="details-panel-segment actions-bar">
      {editMode ? (
        <>
          {(isChanged || isNew) && (
            <SaveIconButton
              alt="Save edits made to marker"
              size={size}
              onClick={saveChanges}
            />
          )}
          {!isNew && (
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
