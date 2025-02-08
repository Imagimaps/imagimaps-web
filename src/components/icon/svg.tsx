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
  const defaultStyle: CSSProperties = {
    width: '24px',
    height: '24px',
  };
  const appliedStyle = style ? { ...defaultStyle, ...style } : defaultStyle;
  // return (
  //   <div className={className} onClick={onClick} onMouseOver={onHover}>
  //     <img src={src} alt={alt} style={appliedStyle} />
  //   </div>
  // );
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={appliedStyle}
      onClick={onClick}
      onMouseOver={onHover}
    />
  );
};

export default SvgIcon;
