import { FC } from 'react';
import { InputText } from 'primereact/inputtext';
import UndoButton from '@components/buttons/icons/undo';
import EditButton from '@components/buttons/icons/edit';

import './styles.scss';

type EditableTitleRowProps = {
  value: string;
  editMode: boolean;
  valueChanged?: boolean;
  onEditEnable?: () => void;
  onChange?: (value: string) => void;
  onUndo?: () => void;
};

const EditableTitleRow: FC<EditableTitleRowProps> = ({
  value,
  editMode,
  valueChanged,
  onEditEnable,
  onChange,
  onUndo,
}) => {
  const processKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.currentTarget.blur();
        break;
      case 'Escape':
        onUndo?.();
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`editable-content-row h1${valueChanged ? ' changed' : ''}`}>
      <div className="row-content">
        {editMode ? (
          <InputText
            className="h1-edit"
            type="text"
            autoFocus={true}
            value={value}
            onFocus={e => e.target.select()}
            onChange={e => onChange?.(e.target.value)}
            onKeyDown={processKeyPress}
          />
        ) : (
          <h1>{value}</h1>
        )}
      </div>
      <div className="row-controls">
        {!editMode && <EditButton onClick={() => onEditEnable?.()} />}
        {editMode && <UndoButton onClick={() => onUndo?.()} />}
      </div>
    </div>
  );
};

export default EditableTitleRow;
