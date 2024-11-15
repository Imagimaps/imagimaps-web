import { FC } from 'react';

import '../src/global.scss';

const TextPrimatives: FC = () => {
  return (
    <div>
      <h1 className="hero">Hero H1</h1>
      <h1>Heading 1</h1>
      <p>
        This is a paragraph of text. It is used to convey information to the
        user.
      </p>
      <h2>Heading 2</h2>
      <p>
        This is a paragraph of text. It is used to convey information to the
        user.
      </p>
      <h3>Heading 3</h3>
      <p>
        This is a paragraph of text. It is used to convey information to the
        user.
      </p>
      <h4>Heading 4</h4>
      <p>
        This is a paragraph of text. It is used to convey information to the
        user.
      </p>
      <h5>Heading 5</h5>
      <p>
        This is a paragraph of text. It is used to convey information to the
        user.
      </p>
      <h6>Heading 6</h6>
      <p>
        This is a paragraph of text. It is used to convey information to the
        user.
      </p>
      <p className="small">
        This is small text, used for information that is less important.
      </p>
      <p className="mini">
        This is tiny text, used for information that is not important.
      </p>
      <p className="metadata">
        This is metadata text, used for representing metadata of an entity.
      </p>
    </div>
  );
};

export default {
  title: 'Primatives/Text',
  component: TextPrimatives,
  argTypes: {},
};

export const Primary = {};
