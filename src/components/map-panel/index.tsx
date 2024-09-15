import { FC, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { useNavigate } from '@modern-js/runtime/router';

import { Map } from '@shared/_types';
import GridPanel from '@components/grid-panel';
import GridPanelCard from '@components/grid-panel/panel-card';
import NewItemCard from '@components/grid-panel/new-item-card';
import NewMapDialog from './dialog-new-map';
import { AppModel } from '@/state/appModel';

import './index.scss';

interface MapPanelProps {
  maps: Map[];
}

const MapPanel: FC<MapPanelProps> = ({ maps }) => {
  const navigate = useNavigate();
  const [{ community, activeWorld }, actions] = useModel(AppModel);
  const [newItemDialogVisible, setNewItemDialogVisible] = useState(false);

  const handleCardClicked = (map: Map) => {
    console.log('Go to map', map?.id);
    actions.setActiveMap(map);
    navigate(
      `/community/${community?.id}/world/${activeWorld?.id}/map/${map?.id}`,
    );
  };

  const generateSubTitle = (map: Map) => {
    if (!map.layers) {
      return 'No Layers';
    }
    if (map.layers?.length === 1) {
      return '1 Layer';
    } else {
      return `${map.layers?.length} Layers`;
    }
  };

  return (
    <>
      <GridPanel header={'Community Maps'} toggleable={{ open: true }}>
        {maps.map(map => (
          <GridPanelCard
            key={map.id}
            title={map.name}
            splashImage={map.icon}
            subtitle={generateSubTitle(map)}
            content={map.description}
            onClick={() => handleCardClicked(map)}
          />
        ))}
        <NewItemCard
          prompt="Add New Map"
          onClick={() => setNewItemDialogVisible(true)}
        />
      </GridPanel>
      {community && activeWorld && (
        <NewMapDialog
          community={community}
          world={activeWorld}
          dialogVisible={newItemDialogVisible}
          setDialogVisible={setNewItemDialogVisible}
          onCreateSuccess={(map: Map) => {
            console.log('Map created', map);
            actions.addMap(map);
          }}
          onCreateFailure={() => {
            console.log('World creation failed');
          }}
        />
      )}
    </>
  );
};

export default MapPanel;
