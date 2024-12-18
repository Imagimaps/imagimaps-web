import { FC } from 'react';

import SaveSvg from '@shared/svg/save.svg';
import IconButton from '.';

type SaveIconProps = {
  onClick: () => void;
  disabled?: boolean;
  alt?: string;
};

const SaveIcon: FC<SaveIconProps> = ({ onClick, disabled, alt }) => {
  return (
    <IconButton
      icon={SaveSvg}
      onClick={onClick}
      disabled={disabled}
      alt={alt ?? 'save'}
    />
  );
};

export default SaveIcon;
