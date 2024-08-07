import styled from '@modern-js/runtime/styled';
import { CSSProperties, FC, MouseEventHandler } from 'react';
import EditSvg from '@shared/svg/edit.svg';
import SvgIcon from '../svg';

interface EditIconButtonProps {
  svgStyle?: CSSProperties;
  alt?: string;
  size?: CSSProperties['width'] | CSSProperties['height'];
  onClick?: MouseEventHandler;
}

export const EditIconButton: FC<EditIconButtonProps> = ({
  svgStyle,
  alt,
  size = '1rem',
  onClick,
}) => {
  return (
    <SvgIconButton
      src={EditSvg}
      alt={alt ?? 'Edit Details'}
      style={svgStyle}
      size={size}
      onClick={onClick}
    />
  );
};

const SvgIconButton = styled(SvgIcon)<{
  size: CSSProperties['width'] | CSSProperties['height'];
}>`
  width: ${props => props.size};
  height: ${props => props.size};
  cursor: pointer;
`;
