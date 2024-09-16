import styled from '@modern-js/runtime/styled';
import { MapMarker } from '@shared/_types';
import { FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { UndoIconButton } from '@/components/icon/buttons';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';

interface TitleRowProps<T> {
  marker: MapMarker;
  editMode: boolean;
  onValueChange?: (value: T) => void;
}

const TitleRow: FC<TitleRowProps<string>> = ({
  marker,
  editMode,
  onValueChange,
}) => {
  const [selectedMarker] = useModel(MapRuntimeModel, m => m.selectedMarker);
  const [name, setName] = useState<string>(marker.name);
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    setName(marker.name);
  }, [marker.name]);

  useEffect(() => {
    const hasChanges = name !== selectedMarker?.name;
    setLocalChanges(hasChanges);
    onValueChange?.(name);
    // console.log('TitleRow: name', name, 'selectedMarker', selectedMarker);
  }, [name, selectedMarker?.name]);

  const processKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.currentTarget.blur();
        break;
      case 'Escape':
        setName(marker?.name ?? '');
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <Row>
      <Content>
        {editMode ? (
          <NameInput
            as="input"
            type="text"
            autoFocus={true}
            value={name}
            onFocus={e => e.target.select()}
            onChange={e => setName(e.target.value)}
            onKeyDown={processKeyPress}
          />
        ) : (
          <Name>{marker?.name}</Name>
        )}
      </Content>
      <Controls>
        {localChanges && (
          <UndoIconButton
            alt="Undo edits made to name"
            onClick={() => {
              setName(selectedMarker?.name ?? '');
            }}
          />
        )}
      </Controls>
    </Row>
  );
};

export default TitleRow;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled.h1`
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NameInput = styled.input`
  font-size: 2rem;
  line-height: 2.5rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  box-shadow: none;
  display: inline-block;
  width: 100%;
`;
