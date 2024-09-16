import { FC, useEffect, useState } from 'react';
import styled from '@modern-js/runtime/styled';
import { useModel } from '@modern-js/runtime/model';
import { DisplayTemplate } from '@shared/_types';
import TemplateGroupDisplay from './templateGroupDisplay';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';

interface TemplatePickerProps {
  selectedTemplate?: DisplayTemplate;
  onTemplateSelected?: (template: DisplayTemplate) => void;
}

const TemplatePicker: FC<TemplatePickerProps> = ({
  selectedTemplate,
  onTemplateSelected,
}) => {
  const [templateGroups] = useModel(
    EngineDataModel,
    model => model.map.templateGroups ?? [],
  );

  const [showGroup, setShowGroup] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (templateGroups.length > 0) {
      const groups: Record<string, boolean> = {};
      templateGroups.forEach((group, index) => {
        if (selectedTemplate) {
          const selectedTemplateInGroup = group.markerTemplates.some(
            template => template.id === selectedTemplate.id,
          );
          if (selectedTemplateInGroup) {
            groups[group.id] = true;
          } else {
            groups[group.id] = false;
          }
        } else if (index === 0) {
          groups[group.id] = true;
        } else {
          groups[group.id] = false;
        }
      });
      setShowGroup(groups);
    }
  }, [templateGroups]);

  return (
    <TemplatePickerBox>
      {templateGroups.map(group => {
        const groupOpen = showGroup[group.id];
        return (
          <TemplateGroupDisplay
            key={`template-group-${group.id}`}
            templateGroup={group}
            selectedTemplate={selectedTemplate}
            show={groupOpen}
            onTemplateSelected={onTemplateSelected}
          />
        );
      })}
    </TemplatePickerBox>
  );
};

export default TemplatePicker;

const TemplatePickerBox = styled.div`
  width: 100%;
`;
