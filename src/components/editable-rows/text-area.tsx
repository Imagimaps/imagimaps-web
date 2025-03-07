import { FC } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import UndoButton from '@components/buttons/icons/undo';
import EditButton from '@components/buttons/icons/edit';

import './styles.scss';

type EditableTextAreaRowProps = {
  value: string;
  editMode: boolean;
  label?: string;
  valueChanged?: boolean;
  onEditEnable?: () => void;
  onChange?: (value: string) => void;
  onUndo?: () => void;
};

const EditableTextAreaRow: FC<EditableTextAreaRowProps> = ({
  value,
  editMode,
  label,
  valueChanged,
  onEditEnable,
  onChange,
  onUndo,
}) => {
  const processKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Escape':
        onUndo?.();
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`editable-content-row ${valueChanged ? ' changed' : ''}`}>
      {label && (
        <div className="metadata-row">
          <p className="metadata">{label}</p>
          <div className="row-controls">
            {!editMode && <EditButton onClick={() => onEditEnable?.()} />}
            {editMode && <UndoButton onClick={() => onUndo?.()} />}
          </div>
        </div>
      )}
      <div className="row-content">
        {editMode ? (
          <InputTextarea
            className="text-area-edit"
            autoFocus={true}
            value={value}
            onFocus={e => e.target.select()}
            onChange={e => onChange?.(e.target.value)}
            onKeyDown={processKeyPress}
          />
        ) : (
          <p>{value}</p>
        )}
      </div>
      {!label && (
        <div className="row-controls">
          {!editMode && <EditButton onClick={() => onEditEnable?.()} />}
          {editMode && <UndoButton onClick={() => onUndo?.()} />}
        </div>
      )}
    </div>
  );
};

export default EditableTextAreaRow;
