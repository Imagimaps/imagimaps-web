import { Card } from 'primereact/card';

import { useNavigate } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { Map } from '@shared/types/map';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

interface MapCardProps {
  map: Map;
}

const MapCard: React.FC<MapCardProps> = ({ map }) => {
  const [{ community, activeWorld }, actions] = useModel(CommunityModel);
  const navigate = useNavigate();

  const goToMap = () => {
    console.log('Go to map', map?.id);
    actions.setViewingMap(map);
    navigate(
      `/community/${community?.id}/world/${activeWorld?.id}/map/${map?.id}`,
    );
  };

  return (
    <Card title={map.name} onClick={goToMap} className="map-card">
      <p>{map.description}</p>
    </Card>
  );
};

export default MapCard;