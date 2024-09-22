import { FC } from 'react';
import { DisplayTemplate } from '@shared/_types';
import SvgIcon from '@/components/icon/svg';

interface TemplateElementProps {
  templateData: DisplayTemplate;
  isSelected?: boolean;
  onSelect?: (template: DisplayTemplate) => void;
}

const TemplateElement: FC<TemplateElementProps> = ({
  templateData,
  isSelected = false,
  onSelect,
}) => {
  const clickHandler = () => {
    onSelect?.(templateData);
  };

  return (
    <div
      className={`template-elements-row ${isSelected ? 'selected' : ''}`}
      onClick={clickHandler}
    >
      <SvgIcon
        className="template-icon"
        src={`https://cdn.dev.imagimaps.com/${templateData?.iconLink}`}
        alt={templateData.name}
      />
      <p>{templateData.name}</p>
    </div>
  );
};

export default TemplateElement;
