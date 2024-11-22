import { FC, useEffect, useRef, useState } from 'react';

import BinIcon from '@shared/svg/delete.svg';
import './delete-button.scss';

type DeleteButtonProps = {
  colorMode?: 'red' | 'black';
  showBorder?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
};

const DeleteButton: FC<DeleteButtonProps> = ({
  colorMode,
  showBorder,
  size,
  onClick,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setConfirmDelete(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`delete-button ${size ?? 'medium'} ${colorMode ?? 'black'} ${
        confirmDelete && 'expanded'
      } ${showBorder && 'border'}`}
      onClick={() => {
        if (!confirmDelete) {
          setConfirmDelete(true);
        } else {
          onClick?.();
        }
      }}
    >
      {confirmDelete && (
        <p
          onClick={() => {
            onClick?.();
          }}
        >
          Confirm
        </p>
      )}
      <img src={BinIcon} onClick={() => setConfirmDelete(true)} />
    </div>
  );
};

export default DeleteButton;
