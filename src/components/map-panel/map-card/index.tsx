import { Card } from 'primereact/card';

import { useNavigate } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { Map } from '@shared/_types';
import { AppModel } from '@/state/appModel';

import './index.scss';

interface MapCardProps {
  map: Map;
}

const MapCard: React.FC<MapCardProps> = ({ map }) => {
  const [{ community, activeWorld }, actions] = useModel(AppModel);
  const navigate = useNavigate();

  const goToMap = () => {
    console.log('Go to map', map?.id);
    actions.setActiveMap(map);
    navigate(
      `/community/${community?.id}/world/${activeWorld?.id}/map/${map?.id}`,
    );
  };

  return (
    <Card title={map.intrinsics.name} onClick={goToMap} className="map-card">
      <p>{map.intrinsics.description}</p>
    </Card>
  );
};

export default MapCard;
