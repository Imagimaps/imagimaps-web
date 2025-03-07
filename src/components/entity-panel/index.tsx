import { FC } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import InfoSvg from '@shared/svg/info.svg';
import SvgIcon from '../icon/svg';

import './index.scss';

type EntityPanelProps = {
  title: string;
  children?: React.ReactNode;
  entityHasChanges: boolean;
  onUndoChanges?: () => Promise<void>;
  onSaveChanges?: () => Promise<void>;
};

const EntityPanel: FC<EntityPanelProps> = ({
  title,
  children: content,
  entityHasChanges,
  onUndoChanges,
  onSaveChanges,
}) => {
  const header = (
    <>
      <div className="header-content">
        <SvgIcon src={InfoSvg} alt="Layers" />
        <h4>{title}</h4>
      </div>
      {entityHasChanges && (
        <div className="actions">
          <Button
            severity="danger"
            icon="pi pi-times"
            onClick={async () => {
              await onUndoChanges?.();
            }}
          >
            Cancel
          </Button>
          <Button
            icon="pi pi-save"
            onClick={async () => {
              await onSaveChanges?.();
            }}
          >
            Save
          </Button>
        </div>
      )}
    </>
  );
  return (
    <Panel className="entity-panel" header={header}>
      {content}
    </Panel>
  );
};

export default EntityPanel;
