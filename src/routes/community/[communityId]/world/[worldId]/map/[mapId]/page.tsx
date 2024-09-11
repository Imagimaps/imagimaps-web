import { useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Link, useNavigate, useParams } from '@modern-js/runtime/router';
import { Panel } from 'primereact/panel';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';

import GetLayers from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]/layer';
import { MapLayer } from '@shared/types/map';
import LayersSvg from '@shared/svg/layers.svg';
import SvgIcon from '@/components/icon/svg';
import TreeView from '@/components/tree-view/treeView';
import { TreeNode } from '@/components/tree-view/types';
import { CommunityModel } from '@/state/communityModel';
import NewMapLayer from '@/components/new-map-layer';
import { MapLayerToTreeNode } from '@/components/tree-view/mapper';

import './page.scss';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [{ activeWorld, activeMap, community }] = useModel(CommunityModel);
  const { communityId, worldId, mapId } = useParams();

  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | undefined>();
  const [stagedLayer, setStagedLayer] = useState<MapLayer | undefined>();

  useEffect(() => {
    if (!activeWorld || !activeMap || !community) {
      console.log('No active world, map, or community', activeWorld, activeMap);
      if (!communityId || !worldId || !mapId) {
        console.log('Missing community, world, or map ID');
        navigate('/communities');
        // TODO: Cascading redirects based on what's missing
      }
      // TODO: Actions to hydrate community, world and map data from ID's
    } else {
      GetLayers(community.id, activeWorld.id, activeMap.id).then(setLayers);
    }
  }, []);

  useEffect(() => {
    const layerNodes = layers.map(MapLayerToTreeNode);
    setTreeData(layerNodes);
  }, [layers]);

  useEffect(() => {
    console.log('Selected Node:', selectedNode);
  }, [selectedNode]);

  useEffect(() => {
    if (stagedLayer) {
      console.log('Staged Layer:', stagedLayer);
      let staged = treeData.find(td => td.id === 'new-layer');
      if (staged) {
        staged.name = stagedLayer.name;
        setTreeData([...treeData]);
      } else {
        staged = {
          id: 'new-layer',
          type: 'layer',
          name: stagedLayer.name,
        };
        setTreeData([...treeData, staged]);
      }
    }
  }, [stagedLayer]);

  console.log('Active Map:', activeMap);

  const newLayerCreated = (layer: MapLayer) => {
    console.log('Created Layer', layer);
    setLayers([...layers, layer]);
    setStagedLayer(undefined);
  };

  const addStagedLayerToTree = () => {
    console.log('Add Tree Node');
    const newLayer: MapLayer = {
      id: 'new-layer',
      name: 'New Layer',
      description: 'New Layer Description',
      parameters: {
        position: {
          x: 0,
          y: 0,
        },
        scale: {
          x: 1,
          y: 1,
        },
      },
      markers: [],
    };
    setStagedLayer(newLayer);
  };

  return (
    <>
      <Panel className="map-details-panel" header={`Map: ${activeMap?.name}`}>
        <p>Id: {activeMap?.id}</p>
        <p>Owner: {activeMap?.owner}</p>
        <p>{activeMap?.description}</p>
        <Link to="workspace">Jump into Map Workspace</Link>
      </Panel>
      <Panel className="map-layers-panel" header="Layers">
        <div className="layers-action-bar">
          <Button
            className=".action-item"
            icon={
              <SvgIcon
                src={LayersSvg}
                alt=""
                style={{
                  width: '1rem',
                  height: '1rem',
                  marginRight: '0.5rem',
                }}
              />
            }
            onClick={addStagedLayerToTree}
          >
            Add Layer
          </Button>
        </div>
        <Splitter className="map-layers-split-panel">
          <SplitterPanel size={25} minSize={10} style={{ overflow: 'auto' }}>
            <TreeView
              data={treeData}
              updateData={setTreeData}
              nodeClicked={node => setSelectedNode(node)}
              style={{ height: 1000, width: 500 }}
            />
          </SplitterPanel>
          <SplitterPanel size={75} minSize={10}>
            <NewMapLayer
              model={stagedLayer}
              onModelChange={(model: MapLayer) => {
                console.log('Model Changed', model);
                setStagedLayer(model);
              }}
              onLayerCreated={newLayerCreated}
            />
          </SplitterPanel>
        </Splitter>
      </Panel>
    </>
  );
};

export default MapPage;
