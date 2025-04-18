import styled, { css, CSSObject } from '@modern-js/runtime/styled';
import { CSSProperties, FC, MouseEventHandler } from 'react';
import SaveSvg from '@shared/svg/save.svg';
import SvgIcon from '../svg';

interface SaveDetailsButtonProps {
  style?: CSSObject;
  alt?: string;
  size?: CSSProperties['width'] | CSSProperties['height'];
  onClick?: MouseEventHandler;
}

export const SaveIconButton: FC<SaveDetailsButtonProps> = ({
  style,
  alt,
  size = '1rem',
  onClick,
}) => {
  return (
    <SvgIconButton
      src={SaveSvg}
      alt={alt ?? 'Save Changes'}
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
