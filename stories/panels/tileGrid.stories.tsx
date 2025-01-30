import '../../src/global.scss';

import TileGrid from '@components/grid-panel';
import Tile from '@components/grid-panel/panel-card';

const Tiles = (
  <>
    <Tile
      splashImage="https://picsum.photos/200/300"
      title="Card 1"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/300/200"
      title="Card 2"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/200"
      title="Card 3"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/250"
      title="Card 4"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/150"
      title="Card 5"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/100"
      title="Card 6"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/50"
      title="Card 7"
      content="Content"
    />
    <Tile
      splashImage="https://picsum.photos/400/100"
      title="Card 8"
      content="Content"
    />
  </>
);

export default {
  title: 'Components/Panel/Tile Grid',
  component: TileGrid,
  argTypes: {
    toggleable: {
      control: { type: 'object' },
    },
  },
};

export const Default = {
  args: {
    children: Tiles,
  },
};

export const Toggleable = {
  args: {
    toggleable: {
      open: true,
    },
    children: Tiles,
  },
};
