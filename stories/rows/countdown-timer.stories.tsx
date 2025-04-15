import '../../src/global.scss';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

import { FC } from 'react';
import { createStore, Provider } from '@modern-js/runtime/model';

import CountdownTimer from '@/components/timers/countdown';
import { TimerModel } from '@/components/imagimapper/state/timers';
import { StagedPointMarkerModel } from '@/components/imagimapper/state/stagedPointMarker';

const mockStore = createStore({
  models: [TimerModel, StagedPointMarkerModel],
  initialState: {
    [TimerModel.name]: {
      selectedTimer: {
        id: '123',
        name: 'Test Timer',
        description: 'Test Description',
        duration: 7896000,
        isRunning: false,
        isPaused: false,
      },
    },
    [StagedPointMarkerModel.name]: {
      _id: '123',
      _type: 'marker',
      _name: 'Test Marker',
      _description: 'Test Marker Description',
      _position: { x: 0, y: 0 },
      _templateId: 'template123',
      _overlayId: 'overlay123',
      isNew: false,
    },
  },
});

type WrapperProps = {
  editMode: boolean;
};
const Wrapper: FC<WrapperProps> = () => (
  <Provider config={{}} store={mockStore}>
    <div style={{ width: '380px', border: '1px solid green' }}>
      <CountdownTimer />
    </div>
  </Provider>
);

export default {
  title: 'Components/Rows/Countdown Timer',
  component: Wrapper,
  argTypes: {
    editMode: {
      control: { type: 'boolean' },
    },
  },
};

export const Default = {
  args: {
    editMode: false,
  },
};
