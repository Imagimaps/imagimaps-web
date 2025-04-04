import { FC } from 'react';
import { InputText } from 'primereact/inputtext';
import { useModel } from '@modern-js/runtime/model';
import StringFilterModel from '../../state/stringFilter';

import './index.scss';

const StringFilter: FC = () => {
  const [{ filterPattern }, actions] = useModel(StringFilterModel);

  return (
    <div className="text-filter-container">
      <InputText
        placeholder="Filter Markers"
        value={filterPattern}
        onChange={e => {
          const { value } = e.target;
          console.log('[StringFilter] Filter Pattern Changed', value);
          actions.setFilterPattern(value);
        }}
      />
    </div>
  );
};

export default StringFilter;
