import '../../src/global.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import EntityPanel from '@components/entity-panel/index';

export default {
  title: 'Components/Panel/Entity',
  component: EntityPanel,
  argTypes: {
    title: { control: 'text' },
    entityHasChanges: { control: 'boolean' },
    onUndoChanges: { action: 'function' },
    onSaveChanges: { action: 'function' },
  },
};

export const Default = {
  args: {
    title: 'Entity Panel',
    entityHasChanges: true,
  },
};
