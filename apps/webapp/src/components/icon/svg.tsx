import styled from '@modern-js/runtime/styled';
import { CSSProperties, FC, MouseEventHandler } from 'react';

interface SvgIconProps {
  src: string;
  alt: string;
  style?: CSSProperties;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onHover?: MouseEventHandler<HTMLDivElement>;
}

const SvgIcon: FC<SvgIconProps> = ({
  src,
  alt,
  style,
  className,
  onClick,
  onHover,
}) => {
  return (
    <div className={className} onClick={onClick} onMouseOver={onHover}>
      <IconImg as="img" src={src} alt={alt} style={style} />
    </div>
  );
};

export default SvgIcon;

const IconImg = styled.img``;
