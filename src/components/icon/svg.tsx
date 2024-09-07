import styled from '@modern-js/runtime/styled';
import { CSSProperties, MouseEventHandler } from 'react';

interface SvgIconProps {
  src: string;
  alt: string;
  style?: CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onHover?: MouseEventHandler<HTMLDivElement>;
}

const SvgIcon = ({
  src,
  alt,
  style,
  className,
  onClick,
  onHover,
}: SvgIconProps) => {
  return (
    <IconContainer
      as="div"
      className={className}
      onClick={onClick}
      onMouseOver={onHover}
    >
      <IconImg as="img" src={src} alt={alt} style={style} />
    </IconContainer>
  );
};

export default SvgIcon;

const IconImg = styled.img``;

const IconContainer = styled.div``;
