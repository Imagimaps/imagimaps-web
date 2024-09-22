import { MapMarker } from '@shared/_types';
import { ChangeEventHandler, FC, useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import Pan4D from '@shared/svg/pan-4d.svg';
import LocationOnMapSvg from '@shared/svg/location-on-map.svg';
import { Metadata } from './styles';
import { UndoIconButton } from '@/components/icon/buttons';
import SvgIcon from '@/components/icon/svg';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';

interface LocationRowProps<T> {
  marker: MapMarker;
  editMode: boolean;
  onValueChange?: (value: T) => void;
}

const LocationRow: FC<LocationRowProps<Point>> = ({
  marker,
  editMode,
  onValueChange,
}) => {
  const [selectedMarker, actions] = useModel(
    EngineDataModel,
    m => m.runtime.selectedMarker,
  );

  const [updatedPoint, setUpdatedPoint] = useState<Point>(marker.position);
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    setUpdatedPoint(marker.position);
  }, [marker.position]);

  useEffect(() => {
    if (selectedMarker) {
      const { x: selX, y: selY } = selectedMarker.position;
      const hasChanges =
        Math.fround(updatedPoint.x) !== Math.fround(selX) ||
        Math.fround(updatedPoint.y) !== Math.fround(selY);
      setLocalChanges(hasChanges);
      onValueChange?.(updatedPoint);
    }
  }, [updatedPoint, selectedMarker?.position]);

  useEffect(() => {
    if (localChanges) {
      actions.showGhostTarget(updatedPoint);
    } else {
      actions.hideGhostTarget();
    }
    return () => {
      actions.hideGhostTarget();
    };
  }, [updatedPoint, localChanges]);

  const updatePoint: ChangeEventHandler<HTMLInputElement> = event => {
    const { id, value } = event.target;
    const tempPoint = { ...updatedPoint };
    if (id === 'x-position') {
      tempPoint.x = Number(value);
    } else if (id === 'y-position') {
      tempPoint.y = Number(value);
    }
    setUpdatedPoint(tempPoint);
  };

  const processKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        console.log('LocationRow: Enter pressed');
        break;
      case 'Escape':
        setUpdatedPoint(selectedMarker?.position ?? { x: 0, y: 0 });
        e.currentTarget.blur();
        break;
      default:
        console.log('LocationRow: Unknown Key', e.key);
        break;
    }
  };

  return (
    <div className="details-panel-row">
      <div className="detail-item">
        <SvgIcon className="meta-icon" src={LocationOnMapSvg} alt="" />
        {editMode ? (
          <>
            <label htmlFor="x-position">x:</label>
            <input
              className="number-input"
              id="x-position"
              type="number"
              value={Math.fround(updatedPoint.x)}
              onChange={updatePoint}
              onKeyDown={processKeyPress}
            />{' '}
            <label htmlFor="y-position">y:</label>
            <input
              className="number-input"
              id="y-position"
              type="number"
              value={Math.fround(updatedPoint.y)}
              onChange={updatePoint}
              onKeyDown={processKeyPress}
            />
            <SvgIcon
              className="location-pan-handle"
              src={Pan4D}
              alt="Shift icon around on map"
            />
          </>
        ) : (
          <Metadata>
            Location {`(x: ${updatedPoint.x}, y: ${updatedPoint.y})`}
          </Metadata>
        )}
      </div>
      <div className="controls">
        {localChanges && (
          <UndoIconButton
            alt="Undo edits made to marker position"
            onClick={() =>
              setUpdatedPoint(selectedMarker?.position ?? { x: 0, y: 0 })
            }
          />
        )}
      </div>
    </div>
  );
};

export default LocationRow;
