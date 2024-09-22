import { DisplayTemplate } from '@shared/_types';
import { FC } from 'react';

import './styles.scss';

interface HeroAreaProps {
  template?: DisplayTemplate;
}

const HeroArea: FC<HeroAreaProps> = ({ template }) => {
  return (
    <div className="details-panel-segment hero">
      <img
        className="hero-icon"
        src={`https://cdn.dev.imagimaps.com/${template?.iconLink}`}
        width={100}
      />
    </div>
  );
};

export default HeroArea;
