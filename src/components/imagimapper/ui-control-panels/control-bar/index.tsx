import { FC } from 'react';

import './index.scss';

const ControlBar: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="map-control-bar">
      <div className="control-bar-content">{children}</div>
    </div>
  );
};

export default ControlBar;
