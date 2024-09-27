import styled, { css, CSSObject } from '@modern-js/runtime/styled';
import { CSSProperties, FC, MouseEventHandler } from 'react';
import DeleteSvg from '@shared/svg/delete.svg';
import SvgIcon from '../svg';

interface EditIconButtonProps {
  svgStyle?: CSSObject;
  alt?: string;
  size?: CSSProperties['width'] | CSSProperties['height'];
  onClick?: MouseEventHandler;
}

export const DeleteIconButton: FC<EditIconButtonProps> = ({
  svgStyle,
  alt,
  size = '1rem',
  onClick,
}) => {
  return (
    <SvgIconButton
      src={DeleteSvg}
      alt={alt ?? 'Delete Item'}
      style={svgStyle}
      size={size}
      onClick={onClick}
    />
  );
};

const SvgIconButton = styled(SvgIcon)<{
  size: CSSProperties['width'] | CSSProperties['height'];
  style?: CSSObject;
}>`
  width: ${props => props.size};
  height: ${props => props.size};
  cursor: pointer;

  ${props => props.style && css(props.style)}
`;
