import { FC } from 'react';

import './role-permission-fragement.scss';

type RolePermissionRuleProps = {
  value: string;
  preExplanation?: string;
  postExplanation?: string;
  options?: string[];
  type: 'select' | 'text' | 'textarea' | 'static';
  onValueChange?: (value: string) => void;
};

const RolePermissionFragment: FC<RolePermissionRuleProps> = ({
  value,
  preExplanation,
  postExplanation,
  options,
  type,
  onValueChange,
}) => {
  return (
    <div className="role-permission-fragement">
      <p>{preExplanation}</p>
      {type === 'select' && (
        <select value={value} onChange={e => onValueChange?.(e.target.value)}>
          {options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {type === 'text' && (
        <input
          type="text"
          value={value}
          onChange={e => onValueChange?.(e.target.value)}
        />
      )}
      {type === 'textarea' && (
        <textarea
          value={value}
          onChange={e => onValueChange?.(e.target.value)}
        />
      )}
      {type === 'static' && <p className="static-value">{value}</p>}
      <p>{postExplanation}</p>
    </div>
  );
};

export default RolePermissionFragment;
