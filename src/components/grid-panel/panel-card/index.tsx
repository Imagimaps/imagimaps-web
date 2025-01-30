import { FC, ReactNode } from 'react';
import { Card } from 'primereact/card';

import PlaceHolderImage from '@assets/icons/landscape-placeholder.svg';

import './index.scss';

export type GridPanelCardProps = {
  title?: string;
  subtitle?: string;
  splashImage?: string | null;
  content?: string | ReactNode;
  onClick?: () => void;
  footer?: ReactNode;
};

const GridPanelCard: FC<GridPanelCardProps> = ({
  title,
  subtitle,
  splashImage,
  content,
  onClick,
  footer,
}) => {
  const header = (
    <img
      className="splash-image"
      src={splashImage || PlaceHolderImage}
      alt="Placeholder"
    />
  );
  return (
    <Card
      title={title}
      subTitle={subtitle}
      className="grid-panel-card"
      onClick={onClick}
      header={header}
      footer={footer}
    >
      <div className="card-content">
        {content && typeof content === 'object' ? (
          content
        ) : (
          <p className="small">{content}</p>
        )}
      </div>
    </Card>
  );
};

export default GridPanelCard;
