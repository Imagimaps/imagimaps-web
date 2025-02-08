import { FC } from 'react';
import '../../src/global.scss';

import Add from '@shared/svg/add.svg';
import CircleQuestion from '@shared/svg/circle-question.svg';
import CloseCircle from '@shared/svg/close-circle.svg';
import Delete from '@shared/svg/delete.svg';
import Fingerprint from '@shared/svg/fingerprint.svg';
import Info from '@shared/svg/info.svg';
import Layers from '@shared/svg/layers.svg';
import LocationOnMap from '@shared/svg/location-on-map.svg';
import Pan4d from '@shared/svg/pan-4d.svg';
import PathBetweenPoints from '@shared/svg/path-between-points.svg';
import Planet from '@shared/svg/planet.svg';
import PolygonArea from '@shared/svg/polygon-area.svg';
import Portal from '@shared/svg/portal.svg';
import Save from '@shared/svg/save.svg';
import TargetCircularDot from '@shared/svg/target-circular-dot.svg';
import Undo from '@shared/svg/undo.svg';
import WorldMap from '@shared/svg/world-map.svg';
import SvgIcon from '@/components/icon/svg';

const AllIcons: FC<{ size?: number }> = ({ size }) => {
  const style = {
    width: `${size ?? 24}px`,
    height: `${size ?? 24}px`,
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'left',
      }}
    >
      <SvgIcon src={Add} style={style} alt="Add" />
      <SvgIcon src={CircleQuestion} style={style} alt="Circle Question" />
      <SvgIcon src={CloseCircle} style={style} alt="Close Circle" />
      <SvgIcon src={Delete} style={style} alt="Delete" />
      <SvgIcon src={Fingerprint} style={style} alt="Fingerprint" />
      <SvgIcon src={Info} style={style} alt="Info" />
      <SvgIcon src={Layers} style={style} alt="Layers" />
      <SvgIcon src={LocationOnMap} style={style} alt="Location On Map" />
      <SvgIcon src={Pan4d} style={style} alt="Pan 4d" />
      <SvgIcon
        src={PathBetweenPoints}
        style={style}
        alt="Path Between Points"
      />
      <SvgIcon src={Planet} style={style} alt="Planet" />
      <SvgIcon src={PolygonArea} style={style} alt="Polygon Area" />
      <SvgIcon src={Portal} style={style} alt="Portal" />
      <SvgIcon src={Save} style={style} alt="Save" />
      <SvgIcon
        src={TargetCircularDot}
        style={style}
        alt="Target Circular Dot"
      />
      <SvgIcon src={Undo} style={style} alt="Undo" />
      <SvgIcon src={WorldMap} style={style} alt="World Map" />
    </div>
  );
};

export default {
  title: 'Primitives/Icons/All',
  component: AllIcons,
  argTypes: {
    size: {
      control: {
        type: 'number',
      },
    },
  },
};

export const Default = {
  args: {
    size: 24,
  },
};
