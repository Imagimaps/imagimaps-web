import '../../src/global.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import Info from '@shared/svg/info.svg';
import { Button } from 'primereact/button';
import SidePanelRow from '@/components/panels/side-panel/row';

export default {
  title: 'Components/Rows/Generic Row',
  component: SidePanelRow,
  argTypes: {
    icon: {
      control: { type: 'text' },
    },
    content: {
      control: false,
    },
    controls: {
      control: false,
    },
    style: {
      control: false,
    },
  },
};

export const Default = {
  args: {
    icon: Info,
    content: <p>Content that goes into this generic row</p>,
    controls: (
      <>
        <Button className="btn btn-primary">Primary</Button>
        <Button className="btn btn-secondary">Secondary</Button>
      </>
    ),
    style: {
      maxWidth: '380px',
      border: '1px solid green',
    },
  },
};
