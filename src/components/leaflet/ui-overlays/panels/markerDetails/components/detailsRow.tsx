import { useStaticModel } from '@modern-js/runtime/model';
import { MapMarker } from '@shared/_types';
import { FC, useState, useEffect } from 'react';
import styled from '@modern-js/runtime/styled';
import TempIcon from '@shared/svg/circle-question.svg';
import { Metadata } from '../../detailsPanel/styles';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';
import SvgIcon from '@/components/icon/svg';
import { UndoIconButton } from '@/components/icon/buttons';

interface DetailsRowProps<T> {
  marker: MapMarker;
  editMode: boolean;
  onValueChange?: (value: T) => void;
}

const DetailsRow: FC<DetailsRowProps<string>> = ({
  marker,
  editMode,
  onValueChange,
}) => {
  const [selectedMarker] = useStaticModel(
    MapRuntimeModel,
    m => m.selectedMarker,
  );
  const [details, setDetails] = useState<string>(marker.description);
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    setDetails(marker.description);
  }, [marker.description]);

  useEffect(() => {
    const hasChanges = details !== selectedMarker?.description;
    setLocalChanges(hasChanges);
    onValueChange?.(details);
  }, [details, selectedMarker?.description]);

  const processKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Enter':
        e.currentTarget.blur();
        break;
      case 'Escape':
        setDetails(marker?.description ?? '');
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <DescriptionArea>
      <Row>
        <Content>
          <MetaIcon src={TempIcon} alt="" />
          <Metadata>Description</Metadata>
        </Content>
        <Controls>
          {localChanges && (
            <UndoIconButton
              alt="Undo edits made to description"
              onClick={() => {
                setDetails(selectedMarker?.description ?? '');
              }}
            />
          )}
        </Controls>
      </Row>
      <Row>
        <Content>
          {editMode ? (
            <DetailsInput
              as="textarea"
              value={details}
              onFocus={e => e.target.select()}
              onChange={e => setDetails(e.target.value)}
              onKeyDown={processKeyPress}
            />
          ) : (
            <Metadata>{marker?.description}</Metadata>
          )}
        </Content>
      </Row>
    </DescriptionArea>
  );
};

export default DetailsRow;

const DescriptionArea = styled.div``;

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

const DetailsInput = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MetaIcon = styled(SvgIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;
