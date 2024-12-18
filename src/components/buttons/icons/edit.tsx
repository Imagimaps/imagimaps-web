import { FC } from 'react';

import EditSvg from '@shared/svg/edit.svg';
import IconButton from '.';

type EditIconProps = {
  onClick: () => void;
  disabled?: boolean;
  alt?: string;
};

const EditIcon: FC<EditIconProps> = ({ onClick, disabled, alt }) => {
  return (
    <IconButton
      icon={EditSvg}
      onClick={onClick}
      disabled={disabled}
      alt={alt ?? 'edit'}
    />
  );
};

export default EditIcon;
