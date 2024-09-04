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
  style?: any;
}

const TreeView: FC<TreeViewProps> = ({ data, style }) => {
  // TODO: Fix issue where updating data out of band does not automatically update the tree. May need to raise an issue on GH.
  const treeRef = useRef<TreeApi<TreeNode> | null>();

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
  };
  const onDelete: DeleteHandler<TreeNode> = ({ ids }) => {
    console.log('Delete Handler', ids);
  };

  return (
    <div>
      <Tree
        ref={treeRef}
        data={data}
        width={style.width ?? '100%'}
        height={style.height ?? 1000}
        onCreate={onCreate}
        onRename={onRename}
        onMove={onMove}
        onDelete={onDelete}
        onSelect={node => console.log('Selected Node', node)}
        onActivate={node => console.log('Activated Node', node)}
        onClick={node => console.log('Clicked Node', node)}
        onContextMenu={node => console.log('Context Menu Node', node)}
        onFocus={node => console.log('Focused Node', node)}
      >
        {Node}
      </Tree>
    </div>
  );
};

export default TreeView;
