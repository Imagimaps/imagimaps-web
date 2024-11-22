import '../src/global.scss';

import DeleteButton from '@components/buttons/delete-button';

export default {
  title: 'Components/Buttons/Delete',
  component: DeleteButton,
  argTypes: {
    colorMode: {
      control: { type: 'select' },
      options: ['red', 'black'],
    },
    showBorder: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Default = {};

export const RedOutlined = {
  args: {
    colorMode: 'red',
    showBorder: true,
  },
};

export const BlackOutlined = {
  args: {
    colorMode: 'black',
    showBorder: true,
  },
};
