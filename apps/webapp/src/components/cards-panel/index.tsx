import { Panel } from 'primereact/panel';

import './index.scss';

export type AppCard = {
  id: string;
  name: string;
  description: string;
};

interface CardPanelProps {
  header: string;
  items: AppCard[];
}

const CardPanel: React.FC<CardPanelProps> = ({ header, items }) => {
  return (
    <Panel header={header} className="cards-panel">
      {items.map(item => (
        <p key={item.id}>{item.name}</p>
      ))}
    </Panel>
  );
};

export default CardPanel;
