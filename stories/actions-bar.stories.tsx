import '../src/global.scss';

import ActionsBar from '@components/actions-bar/index';

export default {
  title: 'Components/Actions Bar',
  component: ActionsBar,
  argTypes: {
    explicitEditMode: {
      control: { type: 'boolean' },
    },
    isChanged: {
      control: { type: 'boolean' },
    },
  },
};

export const Default = {
  args: {
    explicitEditMode: true,
    isChanged: false,
  },
};

export const ImplicitMode = {
  args: {
    explicitEditMode: false,
    isChanged: false,
  },
};
