import { FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';

import { CommunityPermission } from '@shared/types/community';
import { RolesModel } from '../_state/roles';
import RolePermissionFragment from './role-permission-fragement';
import { AppModel } from '@/state/appModel';

import './role-permission-rule.scss';

const RESOURCE_OPTIONS_TEXT: Record<string, string> = {
  '*': 'All Resources',
  community: 'Community',
  user: 'Users',
  role: 'Roles',
  world: 'Worlds',
  map: 'Maps',
  layer: 'Layers',
  marker: 'Markers',
};
const EFFECT_OPTIONS_TEXT: Record<string, string> = {
  allow: 'Allows',
  deny: 'Denies',
};
const ACTION_OPTIONS_TEXT: Record<string, string> = {
  '*': 'All Actions',
  create: 'Create',
  view: 'View',
  edit: 'Edit',
  delete: 'Delete',
};
const RW_ACTION_OPTIONS_TEXT: Record<string, string> = {
  view: 'View',
  edit: 'Edit',
};
const DESCRIMINATOR_TYPE_TEXT: Record<string, string> = {
  id: 'Id',
  name: 'Name',
};

type RolePermissionRuleProps = {
  rule: CommunityPermission;
};

const RolePermissionRule: FC<RolePermissionRuleProps> = ({ rule }) => {
  const [, rolesActions] = useModel(RolesModel);
  const [{ community }] = useModel(AppModel);

  const [resourcePreText] = useState<string | undefined>('This rule for');
  const [resourcePostText] = useState<string | undefined>(',');
  const [effectPreText, setEffectPreText] = useState<string | undefined>(
    undefined,
  );
  const [effectPostText, setEffectPostText] = useState<string | undefined>(
    'this role to',
  );
  const [actionPreText] = useState<string | undefined>(undefined);
  const [actionPostText, setActionPostText] = useState<string | undefined>(
    'anything',
  );

  const [resource, setResource] = useState<string>(rule.resource);
  const [effect, setEffect] = useState<string>(rule.effect);
  const [action, setAction] = useState<string>(rule.action);
  const [parentResource, setParentResource] = useState<string>(
    rule.filterResource || 'community',
  );
  const [parentDiscriminatorType, setParentDiscriminatorType] =
    useState<string>(rule.filterType || 'id');
  const [parentDiscriminatorValue, setParentDiscriminatorValue] =
    useState<string>(rule.filterValue || '*');

  const [validActions, setValidActions] =
    useState<Record<string, string>>(ACTION_OPTIONS_TEXT);
  const [validDescriminators, setValidDescriminators] = useState<string[]>([]);

  useEffect(() => {
    setResource(rule.resource);
    setEffect(rule.effect);
    setAction(rule.action);
  }, [rule]);

  useEffect(() => {
    // Yes, I'm deliberately using switch case fallthrough to
    // build the list of valid discriminators
    const discriminators = [];

    switch (resource) {
      case 'marker':
        discriminators.push('layer');
      // eslint-disable-next-line no-fallthrough
      case 'layer':
        discriminators.push('map');
      // eslint-disable-next-line no-fallthrough
      case 'map':
        discriminators.push('world');
      // eslint-disable-next-line no-fallthrough
      case 'community':
      case 'world':
      case 'role':
      case 'user':
      case '*':
        discriminators.push('community');
        break;
      default:
        break;
    }
    setValidDescriminators(discriminators.map(d => RESOURCE_OPTIONS_TEXT[d]));
    if (discriminators.length === 1) {
      setParentResource(discriminators[0]);
      setParentDiscriminatorType('id');
      setParentDiscriminatorValue(community?.id || '*');
    }
  }, [resource]);

  useEffect(() => {
    if (parentResource === 'community') {
      setParentDiscriminatorType('id');
      setParentDiscriminatorValue(community?.id || '*');
    }
  }, [parentResource]);

  useEffect(() => {
    if (action === '*') {
      setActionPostText(`on ${RESOURCE_OPTIONS_TEXT[resource]}`);
      setEffectPostText('this role');
    } else {
      setActionPostText(`${RESOURCE_OPTIONS_TEXT[resource]}`);
      setEffectPostText('this role to');
    }

    if (resource === 'community') {
      setValidActions(RW_ACTION_OPTIONS_TEXT);
      setEffectPreText(undefined);
      setActionPostText('details of this community');
    }
    if (resource === 'user') {
      setValidActions(RW_ACTION_OPTIONS_TEXT);
      setEffectPreText(undefined);
    }
    if (resource === '*') {
      if (action === '*') {
        setActionPostText('on anything');
        setEffectPostText('this role');
      } else {
        setActionPostText('anything');
        setEffectPostText('this role to');
      }
    }
  }, [resource, effect, action]);

  useEffect(() => {
    rolesActions.updatePermission({ ...rule, resource, effect, action });
  }, [resource, effect, action]);

  return (
    <div className="role-permission-rule">
      <div className="header">Id: {rule.id}</div>
      <div className="body">
        <RolePermissionFragment
          value={RESOURCE_OPTIONS_TEXT[resource]}
          type="select"
          options={Object.values(RESOURCE_OPTIONS_TEXT)}
          preExplanation={resourcePreText}
          postExplanation={resourcePostText}
          onValueChange={value => {
            console.log('Resource Val', value);
            const resourceKey = Object.keys(RESOURCE_OPTIONS_TEXT).find(
              key => RESOURCE_OPTIONS_TEXT[key] === value,
            );
            setResource(resourceKey || 'ERROR');
          }}
        />
        <RolePermissionFragment
          value={EFFECT_OPTIONS_TEXT[effect]}
          type="select"
          options={Object.values(EFFECT_OPTIONS_TEXT)}
          preExplanation={effectPreText}
          postExplanation={effectPostText}
          onValueChange={value => {
            console.log('Effect Val', value);
            const effectKey = Object.keys(EFFECT_OPTIONS_TEXT).find(
              key => EFFECT_OPTIONS_TEXT[key] === value,
            );
            setEffect(effectKey || 'ERROR');
          }}
        />
        <RolePermissionFragment
          value={validActions[action]}
          type="select"
          options={Object.values(validActions)}
          preExplanation={actionPreText}
          postExplanation={actionPostText}
          onValueChange={value => {
            console.log('Action Val', value);
            const actionKey = Object.keys(validActions).find(
              key => validActions[key] === value,
            );
            setAction(actionKey || 'ERROR');
          }}
        />
        <RolePermissionFragment
          value={RESOURCE_OPTIONS_TEXT[parentResource]}
          type={validDescriminators.length > 1 ? 'select' : 'static'}
          options={validDescriminators}
          preExplanation="where"
          onValueChange={value => {
            console.log('Parent Resource', value);
            const resourceKey = Object.keys(RESOURCE_OPTIONS_TEXT).find(
              key => RESOURCE_OPTIONS_TEXT[key] === value,
            );
            setParentResource(resourceKey || 'ERROR');
          }}
        />
        <RolePermissionFragment
          value={DESCRIMINATOR_TYPE_TEXT[parentDiscriminatorType]}
          type={parentResource === 'community' ? 'static' : 'select'}
          options={Object.values(DESCRIMINATOR_TYPE_TEXT)}
          postExplanation="is"
          onValueChange={value => {
            console.log('Parent Discriminator Type', value);
            const typeKey = Object.keys(DESCRIMINATOR_TYPE_TEXT).find(
              key => DESCRIMINATOR_TYPE_TEXT[key] === value,
            );
            setParentDiscriminatorType(typeKey || 'ERROR');
          }}
        />
        <RolePermissionFragment
          value={parentDiscriminatorValue}
          type={parentResource === 'community' ? 'static' : 'text'}
          postExplanation="."
          onValueChange={value => {
            console.log('Parent Discriminator Value', value);
            setParentDiscriminatorValue(value);
          }}
        />
      </div>
      <div>
        <p>
          {effect}:{action}:{resource}/{parentResource}:
          {parentDiscriminatorType}:{parentDiscriminatorValue}
        </p>
      </div>
    </div>
  );
};

export default RolePermissionRule;
