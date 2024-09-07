import { Panel } from 'primereact/panel';
import { Map } from '@shared/types/map';
import MapCard from './map-card';
import NewCard from './new-card';

import './index.scss';

interface MapPanelProps {
  maps: Map[];
}

const MapPanel: React.FC<MapPanelProps> = ({ maps }) => {
  return (
    <Panel header="maps" className="maps-panel">
      <NewCard />
      {maps.map(map => (
        <MapCard key={map.id} map={map} />
      ))}
    </Panel>
  );
};

export default MapPanel;
