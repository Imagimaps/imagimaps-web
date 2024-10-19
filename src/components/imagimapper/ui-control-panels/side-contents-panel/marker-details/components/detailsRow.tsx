import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import styled from '@modern-js/runtime/styled';
import TempIcon from '@shared/svg/circle-question.svg';
import { Metadata } from './styles';
import SvgIcon from '@/components/icon/svg';
import { UndoIconButton } from '@/components/icon/buttons';
import { StagedPointMarkerModel } from '@/components/imagimapper/state/stagedPointMarker';

interface DetailsRowProps {
  editMode: boolean;
}

const DetailsRow: FC<DetailsRowProps> = ({ editMode }) => {
  const [
    { markerDescription, descriptionChanged },
    { setDescription, undoDescriptionChange },
  ] = useModel(StagedPointMarkerModel, m => ({
    markerDescription: m.description?.[2] ?? m.description?.[1] ?? '',
    descriptionChanged: m.description?.[0] ?? false,
  }));

  const processKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case 'Enter':
        e.currentTarget.blur();
        break;
      case 'Escape':
        undoDescriptionChange();
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
          {descriptionChanged && (
            <UndoIconButton
              alt="Undo edits made to description"
              onClick={undoDescriptionChange}
            />
          )}
        </Controls>
      </Row>
      <Row>
        <Content>
          {editMode ? (
            <DetailsInput
              as="textarea"
              value={markerDescription}
              onFocus={e => e.target.select()}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={processKeyPress}
            />
          ) : (
            <Metadata>{markerDescription}</Metadata>
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
