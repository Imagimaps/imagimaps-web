import { FC, useEffect, useState } from 'react';
import styled from '@modern-js/runtime/styled';
import { MdOutlineUnfoldLess, MdOutlineUnfoldMore } from 'react-icons/md';
import { Collapse } from 'react-collapse';
import {
  DisplayTemplate,
  TemplateGroup as MapTemplateGroup,
} from '@shared/_types';
import TemplateElement from './templateElement';

interface TemplateGroupDisplayProps {
  templateGroup: MapTemplateGroup;
  selectedTemplate?: DisplayTemplate;
  show: boolean;
  onTemplateSelected?: (template: DisplayTemplate) => void;
}

const TemplateGroupDisplay: FC<TemplateGroupDisplayProps> = ({
  templateGroup,
  selectedTemplate,
  show,
  onTemplateSelected,
}) => {
  const [showGroup, setShowGroup] = useState<boolean>(show);

  useEffect(() => {
    setShowGroup(show);
  }, [show]);

  const toggleGroup = () => {
    setShowGroup(!showGroup);
  };

  return (
    <TemplateGroupBox>
      <TemplateGroupHeader as="div" onClick={toggleGroup}>
        {showGroup ? <MdOutlineUnfoldLess /> : <MdOutlineUnfoldMore />}
        <GroupName>{templateGroup.name}</GroupName>
      </TemplateGroupHeader>
      <Collapse isOpened={showGroup}>
        <div className="template-group-items">
          {templateGroup.markerTemplates.map(template => {
            return (
              <TemplateElement
                key={template.id}
                templateData={template}
                isSelected={template.id === selectedTemplate?.id}
                onSelect={onTemplateSelected}
              />
            );
          })}
        </div>
      </Collapse>
    </TemplateGroupBox>
  );
};

export default TemplateGroupDisplay;

const TemplateGroupBox = styled.div`
  padding: 5px;
  margin: 5px;
`;

const TemplateGroupHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 0;
  margin-bottom: 5px;
`;

const GroupName = styled.p``;
