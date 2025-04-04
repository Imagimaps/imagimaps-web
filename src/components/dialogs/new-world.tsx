import { FC, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';

import './index.scss';

type NewWorldDialogProps = {
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  onSave: (worldName: string, worldDescription: string) => Promise<void>;
};

const NewWorldDialog: FC<NewWorldDialogProps> = ({
  dialogVisible,
  setDialogVisible,
  onSave,
}) => {
  const [worldName, setWorldName] = useState<string>('');
  const [worldDescription, setWorldDescription] = useState<string>('');
  return (
    <Dialog
      header={'Create a New World'}
      modal
      visible={dialogVisible}
      onHide={() => {
        setDialogVisible(false);
      }}
      content={() => (
        <Panel
          header={'Create a New World'}
          className="new-item-panel"
          footer={
            <>
              <Button
                label="Cancel"
                severity="secondary"
                className="p-button p-component p-button-text-only"
                onClick={() => {
                  setDialogVisible(false);
                  setWorldName('');
                  setWorldDescription('');
                }}
              />
              <Button
                label="Create"
                className="p-button p-component p-button-text-only"
                onClick={async () => {
                  await onSave(worldName, worldDescription);
                  setDialogVisible(false);
                  setWorldName('');
                  setWorldDescription('');
                }}
              />
            </>
          }
        >
          <form className="new-world-form">
            <div className="form-row">
              <label htmlFor="world-name">World name</label>
              <input
                type="text"
                placeholder="World name"
                value={worldName}
                required
                onChange={e => setWorldName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="world-description">World description</label>
              <textarea
                placeholder="World description"
                value={worldDescription}
                onChange={e => setWorldDescription(e.target.value)}
              />
            </div>
          </form>
        </Panel>
      )}
    />
  );
};

export default NewWorldDialog;
