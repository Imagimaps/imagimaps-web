import { FC, useEffect, useState } from 'react';
import styled from '@modern-js/runtime/styled';

import { MapMarker } from '@shared/_types';
import { ActionButtonContainer, ContentRow } from './styles';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';

interface NameRowProps {
  marker: MapMarker;
  openEditable?: boolean;
  onEditing?: (propName: string, isEditing: boolean) => void;
  onSave?: (propName: string) => void;
  onCancel?: (propName: string) => void;
}

const NameRow: FC<NameRowProps> = ({
  marker,
  openEditable = false,
  onEditing,
  onSave,
  onCancel,
}) => {
  const propName = 'name';

  const [showEdit, setShowEdit] = useState(!openEditable);
  const [isEditing, setIsEditing] = useState(openEditable);
  const [updatedName, setUpdatedName] = useState<string>('');

  useEffect(() => {
    if (marker) {
      setUpdatedName(marker.name);
    }
    if (isEditing) {
      setIsEditing(openEditable);
    }
  }, [marker]);

  useEffect(() => {
    onEditing?.(propName, isEditing);
  }, [isEditing]);

  const edit = () => {
    console.log('nameRow edit');
    setIsEditing(true);
    setShowEdit(false);
  };

  const save = () => {
    console.log('nameRow save');

    if (marker) {
      console.log('nameRow save valid', updatedName);
      marker.name = updatedName;
      setIsEditing(false);
      onSave?.(propName);
    }
  };

  const cancel = () => {
    console.log('nameRow cancel');
    if (marker) {
      setUpdatedName(marker.name);
    }
    setIsEditing(false);
    onCancel?.(propName);
  };

  return (
    <ContentRow
      as="div"
      onMouseOver={() => !isEditing && setShowEdit(true)}
      onMouseOut={() => setShowEdit(false)}
    >
      {isEditing ? (
        <>
          <EditNameInput
            as="input"
            type="text"
            autoFocus={true}
            onFocus={e => e.target.select()}
            value={updatedName ?? 'Name Field'}
            onChange={e => setUpdatedName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                save();
              } else if (e.key === 'Escape') {
                cancel();
              }
            }}
          />
          <ActionButtonContainer>
            <SaveIconButton alt="Save name change" onClick={save} />
            <UndoIconButton alt="Undo name changes" onClick={cancel} />
          </ActionButtonContainer>
        </>
      ) : (
        <Name>{marker?.name ?? 'Name Field'}</Name>
      )}
      {showEdit && <EditIconButton onClick={edit} />}
    </ContentRow>
  );
};

export default NameRow;

const Name = styled.h1`
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EditNameInput = styled.input`
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  box-shadow: none;
  display: inline-block;
  width: auto;
`;
