import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

import { RolesModel } from '../_state/roles';
import RolePermissionRule from './role-permission-rule';

const RolePermissionsPanel: FC = () => {
  const [{ editedRole }, rolesActions] = useModel(RolesModel);

  const RolePermissionsPanelHeader = (
    <div className="role-permissions-panel-header">
      <h3>Manage Permissions</h3>
      <Button
        icon="pi pi-plus"
        severity="success"
        aria-label="Filter"
        tooltip="Add a new role"
        tooltipOptions={{ showDelay: 250, hideDelay: 0 }}
        onClick={() => {
          console.log('Add Permission');
          rolesActions.addNewPermission();
        }}
      />
    </div>
  );
  return (
    <Panel header={RolePermissionsPanelHeader}>
      {editedRole?.permissions.length === 0 ? (
        <div>No permissions</div>
      ) : (
        editedRole?.permissions.map(permission => (
          <RolePermissionRule key={permission.id} rule={permission} />
        ))
      )}
    </Panel>
  );
};

export default RolePermissionsPanel;
