import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useModel } from '@modern-js/runtime/model';
import {
  EditIconButton,
  SaveIconButton,
  UndoIconButton,
  DeleteIconButton,
} from '@/components/icon/buttons';
import { StagedDataModel } from '@/components/imagimapper/state/stagedData';
import { EngineDataModel } from '@/components/imagimapper/state/engineData';
import { useRemoteBackends } from '@/hooks/remoteBackends';

import './styles.scss';

interface ActionsBarProps {
  editMode: boolean;
  activateEditMode?: () => void;
  saveChanges?: () => void;
  undoChanges?: () => void;
}

const ActionsBar: FC<ActionsBarProps> = ({
  editMode,
  activateEditMode,
  saveChanges,
  undoChanges,
}) => {
  const { mapApiHost } = useRemoteBackends();
  const [{ isNew, isChanged, mapMarker }, { resetStagedMarker }] =
    useModel(StagedDataModel);
  const [{ map }, { deleteMarker }] = useModel(EngineDataModel);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const size = '1.5rem';

  const { sendJsonMessage } = useWebSocket(
    `ws://${mapApiHost}/api/map/${map.id}/ws`,
    {
      share: true,
    },
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.delete-prompt')) {
        setDeletePrompt(false);
      }
    };

    if (deletePrompt) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [deletePrompt]);

  return (
    <div className="details-panel-segment actions-bar">
      {editMode ? (
        <>
          {(isChanged || isNew) && (
            <SaveIconButton
              alt="Save edits made to marker"
              size={size}
              onClick={saveChanges}
            />
          )}
          {!isNew && (
            <UndoIconButton
              alt="Undo edits made to marker"
              size={size}
              onClick={undoChanges}
            />
          )}
        </>
      ) : (
        <>
          <EditIconButton
            alt="Edit marker details"
            size={size}
            onClick={activateEditMode}
          />
          <div
            className={`delete-prompt ${deletePrompt && 'selected'}`}
            onClick={() => {
              if (deletePrompt && mapMarker) {
                console.log('[ActionsBar] Delete marker:', mapMarker);
                deleteMarker(mapMarker.id);
                resetStagedMarker();
                setDeletePrompt(false);
                sendJsonMessage({
                  type: 'DELETE_MARKER',
                  payload: mapMarker.id,
                });
              }
            }}
          >
            {deletePrompt && <p>Delete?</p>}
            <DeleteIconButton
              alt="Delete marker"
              size={size}
              svgStyle={{
                filter:
                  'invert(27%) sepia(100%) saturate(1000%) hue-rotate(-50deg) brightness(90%) contrast(100%)',
              }}
              onClick={() => {
                setDeletePrompt(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ActionsBar;
