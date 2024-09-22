import { FC, useEffect, useState } from 'react';
import { MdOutlineUnfoldLess, MdOutlineUnfoldMore } from 'react-icons/md';
import { Collapse } from 'react-collapse';
import {
  DisplayTemplate,
  TemplateGroup as MapTemplateGroup,
} from '@shared/_types';
import TemplateElement from './templateElement';

import './styles.scss';

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
    <div className="template-group">
      <div className="template-group-header" onClick={toggleGroup}>
        {showGroup ? (
          <MdOutlineUnfoldLess className="fold-action-icon" />
        ) : (
          <MdOutlineUnfoldMore className="fold-action-icon" />
        )}
        <p>{templateGroup.name}</p>
      </div>
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
    </div>
  );
};

export default TemplateGroupDisplay;
