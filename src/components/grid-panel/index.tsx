import { FC } from 'react';
import { Panel } from 'primereact/panel';

import './index.scss';

type GridPanelProps = {
  children?: React.ReactNode;
  toggleable?:
    | false
    | {
        open: boolean;
      };
  header?: string | React.ReactNode;
};

const GridPanel: FC<GridPanelProps> = ({ children, toggleable, header }) => {
  return (
    <Panel
      className="grid-panel"
      header={header}
      toggleable={typeof toggleable === 'object'}
      collapsed={typeof toggleable === 'object' ? !toggleable.open : false}
    >
      <div className="grid-panel-content">{children}</div>
    </Panel>
  );
};

export default GridPanel;
