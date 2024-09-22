import { useModel } from '@modern-js/runtime/model';
import { DisplayTemplate, MapMarker } from '@shared/_types';
import { FC, useState, useEffect } from 'react';
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
    marker.templateId,
  );
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    setUpdatedTemplateId(marker.templateId);
  }, [marker.templateId]);

  useEffect(() => {
    const hasChanges = updatedTemplateId !== selectedTemplate?.id;
    console.log('TemplateRow: hasChanges', hasChanges);
    setLocalChanges(hasChanges);
    onValueChange?.(updatedTemplateId);
  }, [updatedTemplateId, selectedTemplate]);

  const displayIconSrc = (templateId: string) => {
    const template = templateGroups
      .map(group => group.markerTemplates)
      .flat()
      .find(template => template.id === templateId);
    return template?.iconLink
      ? `https://cdn.dev.imagimaps.com/${template?.iconLink}`
      : 'default';
  };

  const templateFromId = (templateId: string) => {
    return templateGroups
      .map(group => group.markerTemplates)
      .flat()
      .find(template => template.id === templateId);
  };

  return (
    <>
      <div className="details-panel-row">
        <div className="detail-item">
          <SvgIcon
            className="meta-icon"
            src={displayIconSrc(updatedTemplateId)}
            alt="Current Template Display Icon"
          />
          <p className="meta-data">{templateFromId(updatedTemplateId)?.name}</p>
        </div>
        <div className="controls">
          {localChanges && (
            <UndoIconButton
              alt="Undo edits made to marker template type"
              onClick={() => {
                setUpdatedTemplateId(selectedTemplate?.id ?? '');
              }}
            />
          )}
        </div>
      </div>
      {editMode && (
        <div className="details-panel-row">
          <TemplatePicker
            selectedTemplate={templateFromId(updatedTemplateId)}
            onTemplateSelected={(template: DisplayTemplate) => {
              setUpdatedTemplateId(template.id);
            }}
          />
        </div>
      )}
    </>
  );
};

export default TemplateRow;
