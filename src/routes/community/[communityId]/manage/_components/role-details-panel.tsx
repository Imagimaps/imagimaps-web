import { FC, useEffect, useRef, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';

import { post as UpdateRole } from '@api/bff/community/[communityId]/roles';
import { DELETE as DeleteRole } from '@api/bff/community/[communityId]/role/[roleId]';
import { RolesModel } from '../_state/roles';
import RolePermissionsPanel from './role-permissions-panel';
import { AppModel } from '@/state/appModel';
import ActionsBar from '@/components/actions-bar';

import './role-details-panel.scss';

const RoleDetailsPanel: FC = () => {
  const [{ selectedRole, editedRole, rolesWithChanges }, rolesActions] =
    useModel(RolesModel);
  const [{ community }] = useModel(AppModel);
  const [hasChanges, setHasChanges] = useState(false);
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    rolesActions.beginEditingRole(selectedRole?.id);
  }, [selectedRole]);

  useEffect(() => {
    if (selectedRole && rolesWithChanges.length > 0) {
      const roleChanged = rolesWithChanges.some(
        role => role.id === selectedRole.id,
      );
      setHasChanges(roleChanged);
    } else {
      setHasChanges(false);
    }
  }, [selectedRole, rolesWithChanges]);

  const RoleControls = (
    <div className="role-controls">
      <ActionsBar
        isChanged={hasChanges}
        onUndo={rolesActions.revertEditsToCurrentRole}
        onDelete={async () => {
          console.log('Delete role', selectedRole?.id);
          if (!community?.id) {
            console.error('No community id found');
            return;
          }
          if (!selectedRole) {
            console.error('No role found');
            return;
          }
          toastRef.current?.show({
            severity: 'info',
            summary: 'Deleting Role',
            detail: `Deleting role ${selectedRole.name}...`,
            life: 3000,
          });
          try {
            const deletedRoleId = await DeleteRole(
              community.id,
              selectedRole.id,
            );
            rolesActions.deleteRole(deletedRoleId);
            rolesActions.clearSelectedRole();
            toastRef.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Role deleted',
              life: 3000,
            });
          } catch (err) {
            console.error('Failed to delete role', err);
            toastRef.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete role',
              life: 3000,
            });
          }
        }}
        onSave={async () => {
          console.log('Save role');
          if (!community?.id) {
            console.error('No community id found');
            return;
          }
          if (!editedRole) {
            console.error('No role found');
            return;
          }
          toastRef.current?.show({
            severity: 'info',
            summary: 'Saving Role',
            detail: 'Saving role changes...',
            life: 3000,
          });
          try {
            const savedRoles = await UpdateRole(community?.id, {
              query: undefined,
              data: { roles: [editedRole] },
            });
            if (savedRoles.createdRoles.length > 0) {
              console.log('Created role:', savedRoles.createdRoles[0]);
              rolesActions.updateRole(
                editedRole.id,
                savedRoles.createdRoles[0],
              );
            }
            if (savedRoles.updatedRoles.length > 0) {
              console.log('Updated role:', savedRoles.updatedRoles[0]);
              rolesActions.updateRole(
                editedRole.id,
                savedRoles.updatedRoles[0],
              );
            }
            toastRef.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Role saved',
              life: 3000,
            });
          } catch (e) {
            console.error('Failed to save role', e);
            toastRef.current?.show({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save role',
              life: 3000,
            });
          }
        }}
      />
    </div>
  );
  return (
    <div>
      <Toast ref={toastRef} />
      {!selectedRole ? (
        <div>Select a role</div>
      ) : (
        <div className="role-details-panel">
          <Toolbar
            className="role-details-header"
            start={<p className="metadata">Id: {selectedRole.id}</p>}
            end={RoleControls}
          />
          <FloatLabel className="form-group">
            <label htmlFor="role-name">Name</label>
            <InputText
              id="role-name"
              value={editedRole?.name}
              onChange={e => {
                rolesActions.updateRoleName(e.target.value);
              }}
            />
          </FloatLabel>
          <FloatLabel className="form-group">
            <label htmlFor="role-description">Role Description</label>
            <InputTextarea
              id="role-description"
              value={editedRole?.description}
              rows={3}
              onChange={e => {
                rolesActions.updateRoleDescription(e.target.value);
              }}
            />
          </FloatLabel>
          <RolePermissionsPanel />
        </div>
      )}
    </div>
  );
};

export default RoleDetailsPanel;
