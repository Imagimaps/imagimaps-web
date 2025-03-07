import '../../src/global.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import EditableTextAreaRow from '@/components/editable-rows/text-area';

export default {
  title: 'Components/Rows/Editable Text Area',
  component: EditableTextAreaRow,
  argTypes: {
    value: {
      control: { type: 'text' },
    },
    label: {
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
    value:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore ' +
      'et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
      'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse ' +
      'cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in ' +
      'culpa qui officia deserunt mollit anim id est laborum.',
    label: 'Description',
    editMode: false,
    valueChanged: false,
    onChange: (value: string) => console.log(value),
  },
};
