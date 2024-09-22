import { FC, useEffect, useState } from 'react';

import styled from '@modern-js/runtime/styled';
import { useModel } from '@modern-js/runtime/model';
import { DisplayTemplate } from '@shared/_types';
import TemplatePicker from '../template-picker/templatePicker';
import {
  ActionButtonContainer,
  ContentRow,
  Metadata,
  metaDataIconStyle,
} from './styles';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';

interface TypeRowProps {
  onEditing?: (propName: string, isEditing: boolean) => void;
  onSave?: (propName: string) => void;
  onCancel?: (propName: string) => void;
}

const TypeRow: FC<TypeRowProps> = ({ onEditing, onSave, onCancel }) => {
  const propName = 'type';

  const [runtime] = useModel(MapRuntimeModel, model => ({
    marker: model.selectedMarker,
    template: model.selectedTemplate,
  }));

  const [showEdit, setShowEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    DisplayTemplate | undefined
  >(runtime.template);

  useEffect(() => {
    if (isEditing) {
      setIsEditing(false);
    }
  }, [runtime.marker]);

  useEffect(() => {
    setSelectedTemplate(runtime.template);
  }, [runtime.template]);

  useEffect(() => {
    onEditing?.(propName, isEditing);
  }, [isEditing]);

  const edit = () => {
    setIsEditing(true);
    setShowEdit(false);
  };

  const save = () => {
    if (runtime.marker && selectedTemplate) {
      runtime.marker.templateId = selectedTemplate.id;
      onSave?.(propName);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
    setSelectedTemplate(runtime.template);
    onCancel?.(propName);
  };

  const onTemplateSelected = (template: DisplayTemplate) => {
    setSelectedTemplate(template);
  };

  return (
    <ContentRow>
      <TypeRowContainer>
        <TypeRowContent
          as="div"
          onMouseOver={() => !isEditing && setShowEdit(true)}
          onMouseOut={() => setShowEdit(false)}
        >
          <img
            style={{ ...metaDataIconStyle }}
            src={selectedTemplate?.iconData}
          />
          <Metadata>{selectedTemplate?.name}</Metadata>
          {showEdit && <EditIconButton alt="Edit Marker Type" onClick={edit} />}
          {isEditing && (
            <ActionButtonContainer>
              <SaveIconButton alt="Save type change" onClick={save} />
              <UndoIconButton alt="Undo type change" onClick={cancel} />
            </ActionButtonContainer>
          )}
        </TypeRowContent>
        <TypeRowContent>
          {isEditing ? (
            <TemplatePicker
              selectedTemplate={selectedTemplate}
              onTemplateSelected={onTemplateSelected}
            />
          ) : (
            <TypeDescription>
              <Metadata>{selectedTemplate?.description}</Metadata>
            </TypeDescription>
          )}
        </TypeRowContent>
      </TypeRowContainer>
    </ContentRow>
  );
};

export default TypeRow;

const TypeRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const TypeRowContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 0.25rem;
`;

const TypeDescription = styled.div`
  padding-left: calc(1rem + 0.5rem);
  font-size: 0.8rem;
`;
