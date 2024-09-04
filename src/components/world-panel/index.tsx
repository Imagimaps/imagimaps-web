import { Panel } from 'primereact/panel';
import { World } from '@shared/types/world';
import WorldCard from './world-card';

import './index.scss';
import NewCard from './new-card';

interface WorldPanelProps {
  worlds: World[];
}

const WorldPanel: React.FC<WorldPanelProps> = ({ worlds }) => {
  return (
    <Panel header="Worlds" className="worlds-panel">
      <NewCard />
      {worlds.map(world => (
        <WorldCard key={world.id} world={world} />
      ))}
    </Panel>
  );
};

export default WorldPanel;
