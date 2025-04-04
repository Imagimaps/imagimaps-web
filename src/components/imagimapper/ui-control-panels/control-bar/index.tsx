import { FC, useEffect, useRef } from 'react';

import './index.scss';
import L from 'leaflet';

const ControlBar: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const controlBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlBarRef.current) {
      L.DomEvent.disableClickPropagation(controlBarRef.current);
    }
  }, []);

  return (
    <div className="map-control-bar" ref={controlBarRef}>
      <div className="control-bar-content">{children}</div>
    </div>
  );
};

export default ControlBar;
