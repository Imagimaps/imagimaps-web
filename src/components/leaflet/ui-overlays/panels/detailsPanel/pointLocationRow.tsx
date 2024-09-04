import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useEffect,
  useState,
} from 'react';

import styled from '@modern-js/runtime/styled';
import LocationOnMapSvg from '@shared/svg/location-on-map.svg';
import { useModel } from '@modern-js/runtime/model';
import { MapMarker } from '@shared/_types';
import {
  ActionButtonContainer,
  ContentRow,
  Metadata,
  metaDataIconStyle,
} from './styles';
import { MapRuntimeModel } from '@/components/leaflet/mapRuntimeModel';
import SvgIcon from '@/components/icon/svg';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
} from '@/components/icon/buttons';

interface PointLocationRowProps {
  marker: MapMarker;
  openEditable?: boolean;
  onEditing?: (propName: string, isEditing: boolean) => void;
  onSave?: (propName: string) => void;
  onCancel?: (propName: string) => void;
}

const PointLocationRow: FC<PointLocationRowProps> = ({
  marker,
  openEditable = false,
  onEditing,
  onSave,
  onCancel,
}) => {
  const propName = 'position';

  const [, runtimActions] = useModel(MapRuntimeModel);

  const [showEdit, setShowEdit] = useState(!openEditable);
  const [isEditing, setIsEditing] = useState(openEditable);
  const [updatedPoint, setUpdatedPoint] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    if (marker) {
      setUpdatedPoint(marker.position);
    }
    if (isEditing) {
      setIsEditing(openEditable);
    }
  }, [marker]);

  useEffect(() => {
    onEditing?.(propName, isEditing);
  }, [isEditing]);

  const edit = () => {
    setIsEditing(true);
    setShowEdit(false);
  };

  const updatePoint: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = event.target;
    const tempPoint = { ...updatedPoint };
    if (id === 'x-position') {
      tempPoint.x = Number(value);
    } else if (id === 'y-position') {
      tempPoint.y = Number(value);
    }
    runtimActions.showGhostTarget(tempPoint);
    setUpdatedPoint(tempPoint);
  };

  const save = () => {
    marker.position = updatedPoint;
    setIsEditing(false);
    onSave?.(propName);
    runtimActions.hideGhostTarget();
  };

  const cancel = () => {
    setUpdatedPoint(marker.position);
    setIsEditing(false);
    onCancel?.(propName);
  };

  return (
    <ContentRow
      as="div"
      onMouseOver={() => !isEditing && setShowEdit(true)}
      onMouseOut={() => setShowEdit(false)}
    >
      <SvgIcon src={LocationOnMapSvg} alt="" style={metaDataIconStyle} />
      {isEditing ? (
        <>
          <AxisLabel as="label" htmlFor="x-position">
            x:
          </AxisLabel>
          <PointInput
            as="input"
            id="x-position"
            type="number"
            value={updatedPoint.x}
            onChange={updatePoint}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                save();
              } else if (e.key === 'Escape') {
                cancel();
              }
            }}
          />{' '}
          <AxisLabel as="label" htmlFor="y-position">
            y:
          </AxisLabel>
          <PointInput
            as="input"
            id="y-position"
            type="number"
            value={updatedPoint.y}
            onChange={updatePoint}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                save();
              } else if (e.key === 'Escape') {
                cancel();
              }
            }}
          />
          <ActionButtonContainer>
            <SaveIconButton alt="Save changes to location" onClick={save} />
            <UndoIconButton alt="Undo changes to location" onClick={cancel} />
          </ActionButtonContainer>
        </>
      ) : (
        <Metadata>
          Location {`(x: ${marker.position.x}, y: ${marker.position.y})`}
        </Metadata>
      )}

      {showEdit && <EditIconButton onClick={edit} />}
    </ContentRow>
  );
};

export default PointLocationRow;

const AxisLabel = styled.label`
  margin-left: 0.5rem;
  margin-right: 0.25rem;
`;

const PointInput = styled.input`
  width: 5rem;
`;
