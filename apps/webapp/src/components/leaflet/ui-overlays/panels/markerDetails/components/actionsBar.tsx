import { FC } from 'react';
import styled from '@modern-js/runtime/styled';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';

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
    <ActionsBarContainer as="div" iconSize={size}>
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
    </ActionsBarContainer>
  );
};

export default ActionsBar;

const ActionsBarContainer = styled.div<{ iconSize: string }>`
  position: absolute;
  top: ${props => `calc(-1 * (${props.iconSize} + 0.5rem) / 2)`};
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
  gap: 5px;
  background-color: white;
`;
