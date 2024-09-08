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
      title={title || 'Placeholder'}
      subTitle={subtitle}
      className="grid-panel-card"
      onClick={onClick}
      header={header}
      footer={footer}
    >
      <div className="card-content">
        {content && typeof content === 'object' ? content : <p>{content}</p>}
        {!content && (
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        )}
      </div>
    </Card>
  );
};

export default GridPanelCard;
