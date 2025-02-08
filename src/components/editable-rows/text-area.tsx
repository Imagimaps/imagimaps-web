import { FC } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import UndoButton from '@components/buttons/icons/undo';
import EditButton from '@components/buttons/icons/edit';

import './styles.scss';

type EditableTextAreaRowProps = {
  value: string;
  editMode: boolean;
  valueChanged?: boolean;
  onEditEnable?: () => void;
  onChange?: (value: string) => void;
  onUndo?: () => void;
};

const EditableTextAreaRow: FC<EditableTextAreaRowProps> = ({
  value,
  editMode,
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
      <div className="row-controls">
        {!editMode && <EditButton onClick={() => onEditEnable?.()} />}
        {valueChanged && <UndoButton onClick={() => onUndo?.()} />}
      </div>
    </div>
  );
};

export default EditableTextAreaRow;
