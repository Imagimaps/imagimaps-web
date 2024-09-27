import styled, { css, CSSObject } from '@modern-js/runtime/styled';
import { CSSProperties, FC, MouseEventHandler } from 'react';
import UndoSvg from '@shared/svg/undo.svg';
import SvgIcon from '../svg';

interface UndoIconButtonProps {
  style?: CSSObject;
  alt?: string;
  size?: CSSProperties['width'] | CSSProperties['height'];
  onClick?: MouseEventHandler;
}

export const UndoIconButton: FC<UndoIconButtonProps> = ({
  style,
  alt,
  size = '1rem',
  onClick,
}) => {
  return (
    <SvgIconButton
      src={UndoSvg}
      alt={alt ?? 'Undo Changes'}
      style={style}
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
