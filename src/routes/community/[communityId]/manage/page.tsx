import { useEffect, useMemo, useState } from 'react';
import { useParams } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

import type {
  CommunityRole,
  // CommunityPermission,
} from '@shared/types/community';
import GetUserRoles from '@api/bff/community/[communityId]/roles';
import GetCommunityDetails from '@api/bff/community/[communityId]';
import GetWorlds from '@api/bff/community/[communityId]/worlds';
// import MangageCommunityRoles from './_components/manage-community-roles';
import ManageRoles from './_components/manage-roles';
import { RolesModel } from './_state/roles';
import { AppModel } from '@/state/appModel';

import './page.scss';

const ManageCommunityPage: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const [{ community }, actions] = useModel(AppModel);
  const [rolesModel, rolesActions] = useModel(RolesModel);
  const [userRoles] = useState<CommunityRole[]>([]);

  const groups = useMemo(() => {
    return userRoles.reduce((acc, group) => {
      acc.push({ id: group.id, name: group.name });
      return acc;
    }, [] as { id: string; name: string }[]);
  }, [userRoles]);

  const admins = useMemo(() => {
    return community?.admins.map(u => u.displayName);
  }, [community]);

  const users = useMemo(() => {
    return [];
  }, [userRoles, admins]);

  useEffect(() => {
    if (communityId) {
      GetCommunityDetails(communityId).then(c => {
        console.log('Community details retrieved', c);
        actions.setCommunity(c);
      });
      GetUserRoles(communityId).then(roles => {
        console.log('Community Roles:', roles);
        rolesActions.setRoles(roles);
      });
    } else {
      console.error('No community id found');
    }
  }, [communityId]);

  useEffect(() => {
    if (communityId && communityId !== community?.id) {
      GetWorlds(communityId).then((worlds: any) => {
        console.log('Worlds retrieved', worlds);
        actions.setWorlds(worlds);
      });
    }
  }, [communityId]);

  const onGroupEditComplete = (e: any) => {
    const { rowData, newValue, field, originalEvent: event } = e;
    console.log('Group edit complete', e, event);
    console.log('Select from groups', groups);
    rowData[field] = groups.find(g => g.id === newValue)?.name;
  };

  const groupEditor = (props: any) => {
    return (
      <div>
        <select
          onChange={e => {
            console.log('Group editor change', e.target.value);
            props.editorCallback(e.target.value);
          }}
        >
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const userTypeBody = (rowData: any) => {
    type Sev = 'info' | 'success' | 'danger';
    let severity: Sev = 'info';
    if (rowData.type === 'Admin') {
      severity = 'success';
    } else {
      switch (rowData.status) {
        case 'Active':
          severity = 'info';
          break;
        case 'Blocked':
          severity = 'danger';
          break;
        default:
          break;
      }
    }

    return <Tag value={rowData.type} severity={severity} />;
  };

  const userActionsBody = (rowData: any) => {
    return (
      <div>
        {rowData.status === 'Active' ? (
          <button disabled>Block</button>
        ) : (
          <button disabled>Unblock</button>
        )}
      </div>
    );
  };

  const userActionsEditor = (props: any) => {
    console.log('User actions editor', props);
    return (
      <div>
        {props.rowData.status === 'Active' ? (
          <button>Block</button>
        ) : (
          <button>Unblock</button>
        )}
      </div>
    );
  };

  const onRowEditComplete = (e: any) => {
    const { data, newData, index } = e;
    console.log('Row edit complete', newData, index, e);

    const groupUpdated = data.group !== newData.group;
    console.log('Group updated', groupUpdated);
  };

  return (
    <>
      <h1>Manage: {community?.name}</h1>
      <div>
        <TabView>
          <TabPanel header="Community Details">
            <p>Status: {community?.status}</p>
            <p>Owner: {community?.owner.displayName}</p>
            <p>Admins: {community?.admins.map(u => u.displayName)}</p>
            <p>{community?.description} (edit coming soon)</p>
          </TabPanel>
          <TabPanel header="Roles">
            {/* <MangageCommunityRoles /> */}
            {rolesModel.communityRoles.length > 0 ? (
              <ManageRoles />
            ) : (
              <p>Loading</p>
            )}
          </TabPanel>
          <TabPanel header="Users">
            <DataTable
              value={users}
              tableStyle={{ minWidth: '50rem' }}
              editMode="row"
              dataKey="id"
              onRowEditComplete={onRowEditComplete}
            >
              <Column field="id" header="Id" />
              <Column field="name" header="Name" />
              <Column field="type" header="Type" body={userTypeBody} />
              <Column
                field="group"
                header="Group"
                editor={groupEditor}
                onCellEditComplete={onGroupEditComplete}
              />
              <Column
                field="actions"
                header="Actions"
                body={userActionsBody}
                editor={userActionsEditor}
              />
              <Column header="Edit" rowEditor />
            </DataTable>
          </TabPanel>
          <TabPanel header="Artifacts">
            <p>Artifacts coming soon</p>
          </TabPanel>
          <TabPanel header="Plan">
            <p>Coming maybe?</p>
          </TabPanel>
          <TabPanel header="Backup/Restore">
            <p>Hopefully coming soon</p>
          </TabPanel>
        </TabView>
      </div>
    </>
  );
};

export default ManageCommunityPage;
