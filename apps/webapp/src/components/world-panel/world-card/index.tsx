import { World } from 'types/world';
import { Card } from 'primereact/card';

import { useNavigate } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { CommunityModel } from '@/state/communityModel';

import './index.scss';

interface WorldCardProps {
  world: World;
}

const WorldCard: React.FC<WorldCardProps> = ({ world }) => {
  const [{ community }, actions] = useModel(CommunityModel);
  const navigate = useNavigate();

  const goToWorld = () => {
    console.log('Go to world', world?.id);
    actions.setActiveWorld(world);
    navigate(`/community/${community?.id}/world/${world.id}`);
  };

  return (
    <Card title={world.name} onClick={goToWorld} className="world-card">
      <p>{world.description}</p>
    </Card>
  );
};

export default WorldCard;
