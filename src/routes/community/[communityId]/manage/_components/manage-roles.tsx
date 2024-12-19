import { FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';

import { RolesModel } from '../_state/roles';
import RoleDetailsPanel from './role-details-panel';

import './manage-roles.scss';

const ManageRoles: FC = () => {
  const [rolesModel, rolesActions] = useModel(RolesModel);

  const ManageRolePanelHeader = (
    <div className="manage-roles-panel-header">
      <h3>Manage Roles</h3>
      <Button
        icon="pi pi-plus"
        severity="success"
        aria-label="Filter"
        tooltip="Add a new role"
        tooltipOptions={{ showDelay: 250, hideDelay: 0 }}
        onClick={() => {
          console.log('Add role');
          rolesActions.createNewRole();
        }}
      />
    </div>
  );
  return (
    <>
      <Panel header={ManageRolePanelHeader}>
        <Splitter>
          <SplitterPanel size={25} minSize={10}>
            <ListBox
              className="roles-list"
              emptyMessage="Add Role(s)"
              options={[...rolesModel.communityRoles, ...rolesModel.newRoles]}
              optionLabel="name"
              optionValue="id"
              value={rolesModel.selectedRole?.id}
              onChange={e => rolesActions.setSelectedRoleId(e.value)}
              filter
            />
          </SplitterPanel>
          <SplitterPanel size={75} minSize={10}>
            <RoleDetailsPanel />
          </SplitterPanel>
        </Splitter>
      </Panel>
      <Panel header="dbg">
        {rolesModel.rolesWithChanges.map(role => (
          <div key={role.id}>
            {role.name}, perms count: {role.permissions.length}
          </div>
        ))}
      </Panel>
    </>
  );
};

export default ManageRoles;
