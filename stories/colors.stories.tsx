import { FC } from 'react';

import '../src/global.scss';
import './colors.scss';

const ColorSwatches: FC = () => {
  return (
    <div>
      <div
        className="color-swatch"
        style={{ backgroundColor: 'var(--color-primary)' }}
      ></div>
      <div
        className="color-swatch"
        style={{ backgroundColor: 'var(--color-secondary)' }}
      ></div>
      <div
        className="color-swatch"
        style={{ backgroundColor: 'var(--color-tertiary)' }}
      ></div>
      <div
        className="color-swatch"
        style={{ backgroundColor: 'var(--color-text-primary)' }}
      ></div>
      <div
        className="color-swatch"
        style={{ backgroundColor: 'var(--color-background)' }}
      ></div>
      <div>
        <h1>Lorem</h1>
        <h2>Ipsum</h2>
        <h3>Dolor</h3>
        <h4>Sit</h4>
        <h5>Amet</h5>
        <h6>Consectetur</h6>
        <p>adipiscing elit, sed do eiusmod</p>
      </div>
    </div>
  );
};

export default {
  title: 'Primatives/Colors',
  component: ColorSwatches,
  argTypes: {},
};

export const Primary = {};
