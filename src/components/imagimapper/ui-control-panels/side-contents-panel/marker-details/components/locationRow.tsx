import { ChangeEventHandler, FC } from 'react';
import { useModel } from '@modern-js/runtime/model';
import Pan4D from '@shared/svg/pan-4d.svg';
import LocationOnMapSvg from '@shared/svg/location-on-map.svg';
import { Metadata } from './styles';
import { UndoIconButton } from '@/components/icon/buttons';
import SvgIcon from '@/components/icon/svg';
import { StagedDataModel } from '@/components/imagimapper/state/stagedData';
import { UserInteractionsModel } from '@/components/imagimapper/state/userInteractions';

interface LocationRowProps {
  editMode: boolean;
}

const LocationRow: FC<LocationRowProps> = ({ editMode }) => {
  const [model, actions] = useModel(
    [StagedDataModel, UserInteractionsModel],
    (s, _) => ({
      position: s.position?.[2] ?? s.position?.[1] ?? { x: 0, y: 0 },
      positionChanged: s.position?.[0] ?? false,
    }),
  );

  const { position, positionChanged } = model;
  const { setPosition, undoPositionChange } = actions;

  const updatePoint: ChangeEventHandler<HTMLInputElement> = event => {
    const { id, value } = event.target;
    const tempPoint = { ...position };
    if (id === 'x-position') {
      tempPoint.x = Number(value);
    } else if (id === 'y-position') {
      tempPoint.y = Number(value);
    }
    setPosition(tempPoint);
  };

  const processKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        console.log('LocationRow: Enter pressed');
        break;
      case 'Escape':
        undoPositionChange();
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
              value={Math.fround(position.x)}
              onChange={updatePoint}
              onKeyDown={processKeyPress}
            />{' '}
            <label htmlFor="y-position">y:</label>
            <input
              className="number-input"
              id="y-position"
              type="number"
              value={Math.fround(position.y)}
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
          <Metadata>Location {`(x: ${position.x}, y: ${position.y})`}</Metadata>
        )}
      </div>
      <div className="controls">
        {positionChanged && (
          <UndoIconButton
            alt="Undo edits made to marker position"
            onClick={undoPositionChange}
          />
        )}
      </div>
    </div>
  );
};

export default LocationRow;
