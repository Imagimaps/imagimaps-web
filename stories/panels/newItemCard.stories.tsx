import '../../src/global.scss';

import NewItemCard from '@components/grid-panel/new-item-card';

export default {
  title: 'Components/Panel/New Item Card',
  component: NewItemCard,
  argTypes: {
    prompt: {
      control: { type: 'text' },
    },
    onclick: { action: 'clicked' },
  },
};

export const Default = {
  args: {
    prompt: 'Create New Item',
    onclick: () => console.log('Default Clicked'),
  },
};
