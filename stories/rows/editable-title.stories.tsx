import '../../src/global.scss';

import EditableTitleRow from '@/components/editable-rows/title';

export default {
  title: 'Components/Rows/Editable Title',
  component: EditableTitleRow,
  argTypes: {
    value: {
      control: { type: 'text' },
    },
    editMode: {
      control: { type: 'boolean' },
    },
    valueChanged: {
      control: { type: 'boolean' },
    },
  },
};

export const Default = {
  args: {
    value: 'Title',
    editMode: false,
    valueChanged: false,
    onChange: (value: string) => console.log(value),
  },
};
