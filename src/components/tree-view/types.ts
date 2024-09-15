import { IdObj } from 'react-arborist/dist/module/types/utils';

export interface TreeNode extends IdObj {
  name: string;
  editing?: boolean;
  selected?: boolean;
  type: 'layer' | 'overlay' | 'group' | 'marker';
  children?: TreeNode[];
}

export interface TreeNodeData {
  id: string;
  name: string;
  children?: TreeNodeData[];
}

export interface TreeDisplayable extends TreeNode {
  generateTreeData: () => TreeNodeData;
}
