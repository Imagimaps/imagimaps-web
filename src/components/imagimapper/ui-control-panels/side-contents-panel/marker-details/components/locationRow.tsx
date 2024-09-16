import styled from '@modern-js/runtime/styled';
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
  //   console.log('LocationRow: pre-render', marker.position, editMode);
  const [selectedMarker, actions] = useModel(
    EngineDataModel,
    m => m.runtime.selectedMarker,
  );

  const [updatedPoint, setUpdatedPoint] = useState<Point>(marker.position);
  const [localChanges, setLocalChanges] = useState<boolean>(false);

  useEffect(() => {
    // console.log('LocationRow: set updatedPoint', marker.position);
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
    // console.log('LocationRow: point', updatedPoint, 'selectedMarker', {
    //   ...selectedMarker?.position,
    // });
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
    // console.log('LocationRow: updatePoint', tempPoint);
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

  //   console.log('LocationRow: render', marker.position, updatedPoint, editMode);

  return (
    <Row>
      <Content>
        <MetaIcon src={LocationOnMapSvg} alt="" />
        {editMode ? (
          <>
            <AxisLabel as="label" htmlFor="x-position">
              x:
            </AxisLabel>
            <PointInput
              as="input"
              id="x-position"
              type="number"
              value={Math.fround(updatedPoint.x)}
              onChange={updatePoint}
              onKeyDown={processKeyPress}
            />{' '}
            <AxisLabel as="label" htmlFor="y-position">
              y:
            </AxisLabel>
            <PointInput
              as="input"
              id="y-position"
              type="number"
              value={Math.fround(updatedPoint.y)}
              onChange={updatePoint}
              onKeyDown={processKeyPress}
            />
            <PanHandle src={Pan4D} alt="Shift icon around on map" />
          </>
        ) : (
          <Metadata>
            Location {`(x: ${updatedPoint.x}, y: ${updatedPoint.y})`}
          </Metadata>
        )}
      </Content>
      <Controls>
        {localChanges && (
          <UndoIconButton
            alt="Undo edits made to marker position"
            onClick={() =>
              setUpdatedPoint(selectedMarker?.position ?? { x: 0, y: 0 })
            }
          />
        )}
      </Controls>
    </Row>
  );
};

export default LocationRow;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5rem 0;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AxisLabel = styled.label`
  margin-left: 0.5rem;
  margin-right: 0.25rem;
`;

const PointInput = styled.input`
  width: 5rem;
`;

const PanHandle = styled(SvgIcon)`
  margin-left: 0.5rem;
  width: 1rem;
  height: 1rem;
`;

const MetaIcon = styled(SvgIcon)`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
`;
