import { FC, useState } from 'react';

import SaveButton from '@components/buttons/icons/save';
import UndoButton from '@components/buttons/icons/undo';
import EditButton from '@components/buttons/icons/edit';
import DeleteButton from '@components/buttons/delete-button';

import './index.scss';

type ActionsBarProps = {
  explicitEditMode?: boolean;
  isChanged?: boolean;
  externalSave?: boolean;
  onEditEnabled?: () => void;
  onEditDisabled?: () => void;
  onUndo?: () => void;
  onSave?: () => Promise<void>;
  onDelete?: () => Promise<void>;
};

const ActionsBar: FC<ActionsBarProps> = ({
  explicitEditMode,
  isChanged,
  externalSave,
  onEditEnabled,
  onEditDisabled,
  onUndo,
  onSave,
  onDelete,
}) => {
  const [controlsEnabled, setControlsEnabled] = useState(false);

  if (explicitEditMode) {
    return (
      <div className="action-bar">
        {!controlsEnabled && (
          <EditButton
            onClick={() => {
              setControlsEnabled(true);
              onEditEnabled?.();
            }}
          />
        )}
        {controlsEnabled && (
          <>
            <UndoButton
              onClick={() => {
                setControlsEnabled(false);
                onEditDisabled?.();
                onUndo?.();
              }}
            />
            {isChanged && !externalSave && (
              <SaveButton
                onClick={async () => {
                  await onSave?.();
                  setControlsEnabled(false);
                  onEditDisabled?.();
                }}
              />
            )}
            <DeleteButton colorMode="red" onClick={onDelete} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="action-bar">
      {isChanged && (
        <>
          <UndoButton
            onClick={() => {
              setControlsEnabled(false);
              onEditDisabled?.();
              onUndo?.();
            }}
          />
          {!externalSave && (
            <SaveButton
              onClick={async () => {
                await onSave?.();
                setControlsEnabled(false);
                onEditDisabled?.();
              }}
            />
          )}
        </>
      )}
      <DeleteButton colorMode="red" onClick={onDelete} />
    </div>
  );
};

export default ActionsBar;
