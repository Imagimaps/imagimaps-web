import { FC, useEffect, useRef } from 'react';
import {
  Tree,
  TreeApi,
  MoveHandler,
  DeleteHandler,
  RenameHandler,
  CreateHandler,
} from 'react-arborist';
import { TreeNode } from './types';
import Node from './node';

interface TreeViewProps {
  data: TreeNode[];
  updateData?: (data: TreeNode[]) => void;
  nodeClicked?: (node: TreeNode) => void;
  style?: any;
}

const TreeView: FC<TreeViewProps> = ({
  data,
  updateData,
  nodeClicked,
  style,
}) => {
  const treeRef = useRef<TreeApi<TreeNode> | null>(null);

  useEffect(() => {
    console.log('Tree Data Updated', data);
  }, [data]);

  const onCreate: CreateHandler<TreeNode> = async ({
    parentId,
    parentNode,
    index,
    type,
  }) => {
    console.log('Create Handler', parentId, parentNode, index, type);
    return null;
  };
  const onRename: RenameHandler<TreeNode> = ({ id, name }) => {
    console.log('Rename Handler', id, name);
  };
  const onMove: MoveHandler<TreeNode> = ({ dragIds, parentId, index }) => {
    console.log('Move Handler', dragIds, parentId, index);
    const originalIndex = data.findIndex(node => node.id === dragIds[0]);
    const draggedNode = data[originalIndex];
    const dragDirection = originalIndex < index ? 'down' : 'up';
    console.log('Dragged Node', dragDirection, draggedNode);
    let updatedData = [];
    if (dragDirection === 'down') {
      updatedData = [
        ...data.slice(0, originalIndex),
        ...data.slice(originalIndex + 1, index),
        draggedNode,
        ...data.slice(index),
      ];
    } else {
      updatedData = [
        ...data.slice(0, index),
        draggedNode,
        ...data.slice(index, originalIndex),
        ...data.slice(originalIndex + 1),
      ];
    }
    console.log('Updated Data', updatedData);
    updateData?.(updatedData);
  };
  const onDelete: DeleteHandler<TreeNode> = ({ ids }) => {
    console.log('Delete Handler', ids);
  };

  return (
    <div>
      <Tree
        ref={treeRef}
        data={data}
        width={style?.width ?? '100%'}
        height={style?.height ?? 1000}
        onCreate={onCreate}
        onRename={onRename}
        onMove={onMove}
        onDelete={onDelete}
        onSelect={node => console.log('Selected Node', node)}
        onActivate={node => {
          console.log('Activated Node', node);
          nodeClicked?.(node.data);
        }}
        onClick={node => {
          console.log('Clicked Node', node);
        }}
        onContextMenu={node => console.log('Context Menu Node', node)}
        onFocus={node => console.log('Focused Node', node)}
      >
        {Node}
      </Tree>
    </div>
  );
};

export default TreeView;
