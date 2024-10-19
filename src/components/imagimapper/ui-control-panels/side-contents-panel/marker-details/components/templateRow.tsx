import { useModel } from '@modern-js/runtime/model';
import { DisplayTemplate } from '@shared/_types';
import { FC } from 'react';
import TemplatePicker from './template-picker/templatePicker';
import SvgIcon from '@/components/icon/svg';
import { UndoIconButton } from '@/components/icon/buttons';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { StagedPointMarkerModel } from '@/components/imagimapper/state/stagedPointMarker';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';

interface TemplateRowProps {
  editMode: boolean;
}

const TemplateRow: FC<TemplateRowProps> = ({ editMode }) => {
  const [
    { templateId, templateChanged, templateGroups },
    { setTemplateId, undoTemplateChange, templateUsed },
  ] = useModel(
    [StagedPointMarkerModel, UserInteractionsModel, EngineDataModel],
    (s, _, e) => ({
      templateId: s.templateId?.[2] ?? s.templateId?.[1] ?? '',
      templateChanged: s.templateId?.[0] ?? false,
      templateGroups: e.templateGroups,
    }),
  );

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
            src={displayIconSrc(templateId)}
            alt="Current Template Display Icon"
          />
          <p className="meta-data">{templateFromId(templateId)?.name}</p>
        </div>
        <div className="controls">
          {templateChanged && (
            <UndoIconButton
              alt="Undo edits made to marker template type"
              onClick={undoTemplateChange}
            />
          )}
        </div>
      </div>
      {editMode && (
        <div className="details-panel-row">
          <TemplatePicker
            selectedTemplate={templateFromId(templateId)}
            onTemplateSelected={(template: DisplayTemplate) => {
              setTemplateId(template.id);
              templateUsed(template);
            }}
          />
        </div>
      )}
    </>
  );
};

export default TemplateRow;
