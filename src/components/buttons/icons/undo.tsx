import { FC } from 'react';

import UndoSvg from '@shared/svg/undo.svg';
import IconButton from '.';

type UndoIconProps = {
  onClick: () => void;
  disabled?: boolean;
  alt?: string;
};

const UndoIcon: FC<UndoIconProps> = ({ onClick, disabled, alt }) => {
  return (
    <IconButton
      icon={UndoSvg}
      onClick={onClick}
      disabled={disabled}
      alt={alt ?? 'undo'}
    />
  );
};

export default UndoIcon;
