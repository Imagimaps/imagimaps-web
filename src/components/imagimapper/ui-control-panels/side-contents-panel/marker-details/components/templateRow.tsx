import { useModel } from '@modern-js/runtime/model';
import { DisplayTemplate, MapMarker } from '@shared/_types';
import { FC, useState, useEffect } from 'react';
import styled from '@modern-js/runtime/styled';
import { Metadata } from './styles';
import TemplatePicker from './template-picker/templatePicker';
import SvgIcon from '@/components/icon/svg';
import { UndoIconButton } from '@/components/icon/buttons';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';

interface TemplateRowProps<T> {
  marker: MapMarker;
  editMode: boolean;
  onValueChange?: (value: T) => void;
}

const TemplateRow: FC<TemplateRowProps<string>> = ({
  marker,
  editMode,
  onValueChange,
}) => {
  const [{ selectedTemplate, templateGroups }] = useModel(
    EngineDataModel,
    m => {
      return {
        selectedTemplate: m.runtime.selectedTemplate,
        templateGroups: m.map.templateGroups ?? [],
      };
    },
  );

  const [updatedTemplateId, setUpdatedTemplateId] = useState<string>(
    marker.refTemplateid,
  );
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    setUpdatedTemplateId(marker.refTemplateid);
  }, [marker.refTemplateid]);

  useEffect(() => {
    const hasChanges = updatedTemplateId !== selectedTemplate?.id;
    setLocalChanges(hasChanges);
    onValueChange?.(updatedTemplateId);
  }, [updatedTemplateId, selectedTemplate]);

  const displayIconSrc = (templateId: string) => {
    const template = templateGroups
      .map(group => group.markerTemplates)
      .flat()
      .find(template => template.id === templateId);
    return template?.imgSrc ?? '';
  };

  const templateFromId = (templateId: string) => {
    return templateGroups
      .map(group => group.markerTemplates)
      .flat()
      .find(template => template.id === templateId);
  };

  return (
    <>
      <Row>
        <Content>
          <MetaIcon
            src={displayIconSrc(updatedTemplateId)}
            alt="Current Template Display Icon"
          />
          <Metadata>{templateFromId(updatedTemplateId)?.name}</Metadata>
        </Content>
        <Controls>
          {localChanges && (
            <UndoIconButton
              alt="Undo edits made to marker template type"
              onClick={() => {
                setUpdatedTemplateId(selectedTemplate?.id ?? '');
              }}
            />
          )}
        </Controls>
      </Row>
      {editMode && (
        <Row>
          <Content>
            <Metadata>
              <TemplatePicker
                selectedTemplate={templateFromId(updatedTemplateId)}
                onTemplateSelected={(template: DisplayTemplate) => {
                  setUpdatedTemplateId(template.id);
                }}
              />
            </Metadata>
          </Content>
        </Row>
      )}
    </>
  );
};

export default TemplateRow;

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

const MetaIcon = styled(SvgIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;
