import { FC } from 'react';
import { Card } from 'primereact/card';

import AddNewIcon from '@assets/icons/add_new.svg';

import './index.scss';

export type NewItemCardProps = {
  prompt?: string;
  onClick?: () => void;
};

const NewItemCard: FC<NewItemCardProps> = ({ prompt, onClick }) => {
  return (
    <Card className="grid-panel-new-item-card" onClick={onClick}>
      <img
        className="new-item-icon"
        src={AddNewIcon}
        alt={prompt || 'Add New Item'}
        color={'grey'}
      />
      <p>{prompt}</p>
    </Card>
  );
};

export default NewItemCard;
