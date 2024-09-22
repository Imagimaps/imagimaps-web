import { MapMarker } from '@shared/_types';
import { FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { UndoIconButton } from '@/components/icon/buttons';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';

import './styles.scss';

interface TitleRowProps<T> {
  marker: MapMarker;
  editMode: boolean;
  onValueChange?: (value: T) => void;
}

const TitleRow: FC<TitleRowProps<string>> = ({
  marker,
  editMode,
  onValueChange,
}) => {
  const [selectedMarker] = useModel(MapRuntimeModel, m => m.selectedMarker);
  const [name, setName] = useState<string>(marker.name);
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    setName(marker.name);
  }, [marker.name]);

  useEffect(() => {
    const hasChanges = name !== selectedMarker?.name;
    setLocalChanges(hasChanges);
    onValueChange?.(name);
    // console.log('TitleRow: name', name, 'selectedMarker', selectedMarker);
  }, [name, selectedMarker?.name]);

  const processKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        e.currentTarget.blur();
        break;
      case 'Escape':
        setName(marker?.name ?? '');
        e.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <div className="details-panel-row">
      <div className="detail-item">
        {editMode ? (
          <input
            className="h1-edit"
            type="text"
            autoFocus={true}
            value={name}
            onFocus={e => e.target.select()}
            onChange={e => setName(e.target.value)}
            onKeyDown={processKeyPress}
          />
        ) : (
          <h1>{marker?.name}</h1>
        )}
      </div>
      <div className="controls">
        {localChanges && (
          <UndoIconButton
            alt="Undo edits made to name"
            onClick={() => {
              setName(selectedMarker?.name ?? '');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TitleRow;
