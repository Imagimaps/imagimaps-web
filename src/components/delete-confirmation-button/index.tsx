import { FC, useEffect, useRef, useState } from 'react';

import { DeleteIconButton } from '@/components/icon/buttons';

import './styles.scss';

type DeleteConfirmationButtonProps = {
  onDelete: () => void;
};

const DeleteConfirmationButton: FC<DeleteConfirmationButtonProps> = ({
  onDelete,
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setDeleteConfirmation(false);
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
      className={`delete-confirmation-button ${
        deleteConfirmation && 'selected'
      }`}
      onClick={() => {
        if (!deleteConfirmation) {
          setDeleteConfirmation(true);
        } else {
          onDelete();
        }
      }}
    >
      {deleteConfirmation && <span>Confirm</span>}
      <DeleteIconButton
        alt="Delete marker"
        size={'1rem'}
        svgStyle={{ paddingBottom: '0.2rem' }}
        onClick={() => {
          setDeleteConfirmation(true);
        }}
      />
    </div>
  );
};

export default DeleteConfirmationButton;
