import { FC } from 'react';
import '../../src/global.scss';

import SaveButton from '@components/buttons/icons/save';
import UndoButton from '@components/buttons/icons/undo';
import EditButton from '@components/buttons/icons/edit';

const IconButtons: FC<{
  disabled: boolean;
}> = ({ disabled }) => (
  <div
    style={{
      display: 'flex',
      gap: '10px',
    }}
  >
    <EditButton onClick={() => null} disabled={disabled} />
    <UndoButton onClick={() => null} disabled={disabled} />
    <SaveButton onClick={() => null} disabled={disabled} />
  </div>
);

export default {
  title: 'Components/Buttons/Icons',
  component: IconButtons,
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export const Default = {
  args: {
    disabled: false,
  },
};
