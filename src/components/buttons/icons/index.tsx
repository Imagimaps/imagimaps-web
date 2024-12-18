import { FC } from 'react';

import './index.scss';

export type IconButtonProps = {
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  alt?: string;
};

const IconButton: FC<IconButtonProps> = ({ icon, onClick, disabled, alt }) => {
  return (
    <div className="icon-wrapper">
      <img
        className={`icon ${disabled ? 'disabled' : ''}`}
        src={icon}
        onClick={onClick}
        alt={alt}
      />
    </div>
  );
};

export default IconButton;
