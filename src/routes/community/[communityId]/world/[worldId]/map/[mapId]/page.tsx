import { useEffect, useState } from 'react';
import { useModel } from '@modern-js/runtime/model';
import { Link, useNavigate, useParams } from '@modern-js/runtime/router';
import { Panel } from 'primereact/panel';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';

import GetLayers from '@api/bff/community/[communityId]/world/[worldId]/map/[mapId]/layer';
import LayersSvg from '@shared/svg/layers.svg';
import { LayerStatus, MapLayer, MapTopography } from '@shared/_types';
import SvgIcon from '@/components/icon/svg';
import TreeView from '@/components/tree-view/treeView';
import { TreeNode } from '@/components/tree-view/types';
import { AppModel } from '@/state/appModel';
import NewMapLayer from '@/components/new-map-layer';
import { MapLayerToTreeNode } from '@/components/tree-view/mapper';
import MapLayerDetails from '@/components/map-layer-details';

import './page.scss';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const [{ activeWorld, activeMap, community }, appActions] =
    useModel(AppModel);
  const { communityId, worldId, mapId } = useParams();

  const [layers, setLayers] = useState<MapLayer[]>([]);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | undefined>();
  const [selectedLayer, setSelectedLayer] = useState<MapLayer | undefined>();
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
    if (!selectedLayer && layers.length > 1) {
      setSelectedLayer(layers[0]);
    }
    console.log('Updating Tree Data', layerNodes);
    setTreeData(layerNodes);
  }, [layers, selectedLayer]);

  useEffect(() => {
    console.log('Selected Node:', selectedNode);
  }, [selectedNode]);

  useEffect(() => {
    console.log('Selected Layer:', selectedLayer);
    if (selectedLayer) {
      appActions.setActiveLayer(selectedLayer);
    }
  }, [selectedLayer]);

  useEffect(() => {
    if (stagedLayer) {
      console.log('Staged Layer:', stagedLayer);
      let staged = treeData.find(td => td.id === 'new-layer');
      if (staged) {
        staged.name = stagedLayer.name;
        staged.editing = true;
        setTreeData([...treeData]);
      } else {
        staged = {
          id: 'new-layer',
          type: 'layer',
          name: stagedLayer.name,
          editing: true,
        };
        setTreeData([...treeData, staged]);
      }
    } else {
      const staged = treeData.find(td => td.id === 'new-layer');
      if (staged) {
        setTreeData(treeData.filter(td => td.id !== 'new-layer'));
      }
    }
  }, [stagedLayer]);

  const newLayerCreated = (layer: MapLayer) => {
    console.log('Created Layer', layer);
    setLayers([...layers, layer]);
    setStagedLayer(undefined);
  };

  const treeNodeSelected = (node: TreeNode) => {
    console.log('Tree Node Selected ', node);
    if (node.id !== 'new-layer') {
      setSelectedNode(node);
      const layer = layers.find(l => l.id === node.id);
      setSelectedLayer(layer);
      // TODO: Prompt about unsaved changes
      setStagedLayer(undefined);
    }
  };

  const addStagedLayerToTree = () => {
    console.log('Add Tree Node');
    const newLayer: MapLayer = {
      type: 'Layer',
      id: 'new-layer',
      name: 'New Layer',
      description: 'New Layer Description',
      status: LayerStatus.PROCESSING,
      imagePath: '',
      topography: {
        position: { x: 0, y: 0 },
        bounds: { top: 0, left: 0, bottom: 0, right: 0 },
        scale: { x: 1, y: 1 },
      } as MapTopography,
      overlays: [],
    };
    setStagedLayer(newLayer);
  };

  return (
    <>
      <Panel className="map-details-panel" header={`Map: ${activeMap?.name}`}>
        <p>Id: {activeMap?.id}</p>
        <p>
          Owner:{' '}
          {typeof activeMap?.owner === 'string'
            ? activeMap?.owner
            : activeMap?.owner?.name}
        </p>
        <p>{activeMap?.description}</p>
        <div className="button primary">
          <Link to="workspace">Enter Map Workspace</Link>
        </div>
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
              nodeClicked={treeNodeSelected}
              style={{ height: 1000, width: 500 }}
            />
          </SplitterPanel>
          <SplitterPanel size={75} minSize={10}>
            {!stagedLayer && <MapLayerDetails model={selectedLayer} />}
            {stagedLayer && (
              <NewMapLayer
                model={stagedLayer}
                onModelChange={(model: MapLayer) => {
                  console.log('Model Changed', model);
                  setStagedLayer(model);
                }}
                onLayerCreated={newLayerCreated}
              />
            )}
          </SplitterPanel>
        </Splitter>
      </Panel>
    </>
  );
};

export default MapPage;
