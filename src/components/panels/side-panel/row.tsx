import { FC, JSX } from 'react';
import SvgIcon from '@/components/icon/svg';

import './row.scss';

type SidePanelRowProps = {
  icon?: string;
  content: JSX.Element;
  controls?: JSX.Element;
  className?: string;
  style?: React.CSSProperties;
};

const SidePanelRow: FC<SidePanelRowProps> = ({
  icon,
  content,
  controls,
  className,
  style,
}) => {
  return (
    <div
      className={`side-panel-row ${className || ''}`.trimEnd()}
      style={style}
    >
      <SvgIcon className="meta-icon" src={icon || ''} alt="" />
      <div className="row-content">{content}</div>
      <div className="row-controls">{controls}</div>
    </div>
  );
};

export default SidePanelRow;
