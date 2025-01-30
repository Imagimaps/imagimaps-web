import '../../src/global.scss';

import Tile from '@components/grid-panel/panel-card';

export default {
  title: 'Components/Panel/Tile',
  component: Tile,
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    subtitle: {
      control: { type: 'text' },
    },
    splashImage: {
      control: { type: 'text' },
    },
    content: {
      control: { type: 'text' },
    },
    footer: {
      control: { type: 'text' },
    },
  },
  actions: {
    onclick: { action: 'clicked' },
  },
};

export const Default = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    splashImage: 'https://picsum.photos/400/300',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    footer: 'Footer',
    onclick: () => console.log('Default Clicked'),
  },
};

export const TallImage = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    splashImage: 'https://picsum.photos/300/500',
    content: 'Content',
    footer: 'Footer',
    onclick: () => console.log('TallImage Clicked'),
  },
};

export const NoContent = {
  args: {
    onclick: () => console.log('NoContent Clicked'),
  },
};

export const LongContent = {
  args: {
    title: 'A very very long title that should be truncated',
    subtitle: 'Subtitle that stretches the limits of computer screens',
    splashImage: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Test.svg',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunce consectetur adipiscing ' +
      'elit. Nullam nec purus nec nunce consectetur adipiscing elit. Nullam nec purus nec nunce',
    footer: 'Footer so big it will make your head spin',
    onclick: () => console.log('LongContent Clicked'),
  },
};

export const CustomContent = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    content: (
      <div>
        <p>Hello World</p>
      </div>
    ),
    footer: 'Footer',
    onclick: () => console.log('CustomContent Clicked'),
  },
};
