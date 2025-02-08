import { FC, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';

import './index.scss';

type NewMapDialogProps = {
  dialogVisible: boolean;
  setDialogVisible: (visible: boolean) => void;
  onSave: (mapName: string, mapDescription: string) => Promise<void>;
};

const NewMapDialog: FC<NewMapDialogProps> = ({
  dialogVisible,
  setDialogVisible,
  onSave,
}) => {
  const [mapName, setMapName] = useState<string>('');
  const [mapDescription, setMapDescription] = useState<string>('');
  return (
    <Dialog
      header={'Create a New Map'}
      modal
      visible={dialogVisible}
      onHide={() => {
        setDialogVisible(false);
      }}
      content={() => (
        <Panel
          header={'Create a New Map'}
          className="new-item-panel"
          footer={
            <>
              <Button
                label="Cancel"
                severity="secondary"
                className="p-button p-component p-button-text-only"
                onClick={() => {
                  setDialogVisible(false);
                  setMapName('');
                  setMapDescription('');
                }}
              />
              <Button
                label="Create"
                className="p-button p-component p-button-text-only"
                onClick={async () => {
                  await onSave(mapName, mapDescription);
                  setDialogVisible(false);
                  setMapName('');
                  setMapDescription('');
                }}
              />
            </>
          }
        >
          <form className="new-map-form">
            <div className="form-row">
              <label htmlFor="map-name">Map name</label>
              <input
                type="text"
                placeholder="Map name"
                value={mapName}
                required
                onChange={e => setMapName(e.target.value)}
              />
            </div>
            <div className="form-row">
              <label htmlFor="map-description">Map description</label>
              <textarea
                placeholder="Map description"
                value={mapDescription}
                onChange={e => setMapDescription(e.target.value)}
              />
            </div>
          </form>
        </Panel>
      )}
    />
  );
};

export default NewMapDialog;
