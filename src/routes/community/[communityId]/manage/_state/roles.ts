import { model } from '@modern-js/runtime/model';
import { CommunityPermission, CommunityRole } from '@shared/types/community';
import { ulid } from 'ulid';

type RolesState = {
  communityRoles: CommunityRole[];
  selectedRole?: CommunityRole;
  editedRoles: CommunityRole[];
  newRoles: CommunityRole[];
};

const permissionsDeepEqual = (
  a?: CommunityPermission,
  b?: CommunityPermission,
) => {
  if (!a || !b) {
    return false;
  }
  return (
    a.id === b.id &&
    a.effect === b.effect &&
    a.action === b.action &&
    a.resource === b.resource &&
    a.filterResource === b.filterResource &&
    a.filterType === b.filterType &&
    a.filterValue === b.filterValue
  );
};

export const RolesModel = model<RolesState>('roles').define({
  state: {
    communityRoles: [],
    editedRoles: [],
    newRoles: [],
  },
  computed: {
    editedRole: (state: RolesState) => {
      return state.editedRoles?.find(
        role => role.id === state.selectedRole?.id,
      );
    },
    rolesWithChanges: (state: RolesState) => {
      const rolesWithChanges = state.editedRoles?.filter(role => {
        if (role.id.startsWith('new/')) {
          return true;
        }
        const originalRole = state.communityRoles.find(
          originalRole => originalRole.id === role.id,
        );

        const roleDetailsChanged =
          originalRole?.name !== role.name ||
          originalRole?.description !== role.description;
        if (roleDetailsChanged) {
          return true;
        }

        const permissionsAdded = role.permissions.some(p =>
          p.id.startsWith('new/'),
        );
        if (permissionsAdded) {
          return true;
        }

        const permissionsChanged = originalRole?.permissions.some(p => {
          const editedPermission = role.permissions.find(
            editedPermission => editedPermission.id === p.id,
          );
          return !permissionsDeepEqual(p, editedPermission);
        });
        const permissionsDeleted = originalRole?.permissions.some(
          op => !role?.permissions.some(p => op.id === p.id),
        );
        return permissionsChanged || permissionsDeleted;
      });
      return rolesWithChanges;
    },
  },
  actions: {
    setRoles: (state: RolesState, roles: CommunityRole[]) => {
      state.communityRoles = roles;
    },
    setSelectedRoleId: (state: RolesState, roleId: string) => {
      const role = state.communityRoles.find(role => role.id === roleId);
      if (role) {
        state.selectedRole = role;
        return;
      }
      const newRole = state.newRoles.find(role => role.id === roleId);
      state.selectedRole = newRole;
    },
    clearSelectedRole: (state: RolesState) => {
      state.selectedRole = undefined;
    },
    createNewRole: (state: RolesState) => {
      const newRole = {
        id: `new/${ulid()}`,
        name: `New Role ${state.newRoles.length + 1}`,
        description: '',
        permissions: [],
      };
      state.newRoles = [...state.newRoles, newRole];
      state.selectedRole = newRole;
      state.editedRoles = [...state.editedRoles, newRole];
    },
    beginEditingRole: (state: RolesState, roleId?: string) => {
      const roleToEdit = state.communityRoles.find(role => role.id === roleId);
      const roleAlreadyBeingEdited = state.editedRoles?.find(
        role => role.id === roleId,
      );
      if (roleAlreadyBeingEdited) {
        return;
      }
      if (!roleToEdit) {
        return;
      }
      state.editedRoles = [...state.editedRoles, roleToEdit];
    },
    revertEditsToCurrentRole: (state: RolesState) => {
      state.editedRoles = state.editedRoles.map(role =>
        role.id !== state.selectedRole?.id ? role : state.selectedRole,
      );
    },
    updateRole: (
      state: RolesState,
      roleId: string,
      updatedRole: CommunityRole,
    ) => {
      if (roleId.startsWith('new/')) {
        state.selectedRole = updatedRole;
        state.newRoles = state.newRoles.filter(role => role.id !== roleId);
        state.editedRoles = state.editedRoles.map(role => {
          if (role.id === roleId) {
            return updatedRole;
          }
          return role;
        });
        state.communityRoles = [...state.communityRoles, updatedRole];
        return;
      }
      state.communityRoles = state.communityRoles.map(role =>
        role.id === roleId ? updatedRole : role,
      );
      state.editedRoles = state.editedRoles.map(role =>
        role.id === roleId ? updatedRole : role,
      );
    },
    deleteRole: (state: RolesState, roleId: string) => {
      state.communityRoles = state.communityRoles.filter(
        role => role.id !== roleId,
      );
      state.editedRoles = state.editedRoles.filter(role => role.id !== roleId);
    },
    updateRoleName: (state: RolesState, name: string) => {
      const editRole = state.editedRoles?.find(
        role => role.id === state.selectedRole?.id,
      );
      if (editRole) {
        editRole.name = name;
      }
    },
    updateRoleDescription: (state: RolesState, description: string) => {
      const editRole = state.editedRoles?.find(
        role => role.id === state.selectedRole?.id,
      );
      if (editRole) {
        editRole.description = description;
      }
    },
    addNewPermission: (state: RolesState) => {
      const editedRole = state.editedRoles.find(
        role => role.id === state.selectedRole?.id,
      );
      if (editedRole) {
        editedRole.permissions = [
          {
            id: `new/${ulid()}`,
            effect: 'deny',
            action: 'view',
            resource: '*',
            filterResource: '*',
            filterType: 'name',
            filterValue: '*',
          },
          ...editedRole.permissions,
        ];
      }
    },
    updatePermission: (state: RolesState, permission: CommunityPermission) => {
      const editedRole = state.editedRoles.find(
        role => role.id === state.selectedRole?.id,
      );
      if (!editedRole) {
        console.error('No role found to update permission');
        return;
      }
      editedRole.permissions = editedRole.permissions.map(p =>
        p.id === permission.id ? permission : p,
      );
    },
    deletePermission: (state: RolesState, permissionId: string) => {
      const editedRole = state.editedRoles.find(
        role => role.id === state.selectedRole?.id,
      );
      if (!editedRole) {
        console.error('No role found to delete permission');
        return;
      }
      editedRole.permissions = editedRole.permissions.filter(
        p => p.id !== permissionId,
      );
    },
    undoPermissionChanges: (state: RolesState, permissionId) => {
      const editedRole = state.editedRoles.find(
        role => role.id === state.selectedRole?.id,
      );
      if (!editedRole) {
        console.error('No role found to undo permission changes');
        return;
      }
      const editedPermission = editedRole.permissions.find(
        p => p.id === permissionId,
      );
      if (!editedPermission) {
        console.error('No permission found to undo changes');
        return;
      }
      const originalPermission = state.selectedRole?.permissions.find(
        p => p.id === permissionId,
      );
      if (!originalPermission) {
        console.error('No original permission found to undo changes');
        return;
      }
      editedRole.permissions = editedRole.permissions.map(p =>
        p.id === permissionId ? originalPermission : p,
      );
    },
  },
});
