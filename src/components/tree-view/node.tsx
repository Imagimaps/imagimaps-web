import { FC } from 'react';
import { NodeRendererProps } from 'react-arborist';
import { MdArrowRight, MdArrowDropDown } from 'react-icons/md';
import { IconType } from 'react-icons';

import { TreeNode } from './types';

import './node.scss';

const Node: FC<NodeRendererProps<TreeNode>> = ({ node, style, dragHandle }) => {
  const icon = '🗀';
  const contextText = '';
  const tooltipText = `node id: ${node.data.id}`;
  let ExpandIcon: IconType | undefined;
  if (node.isInternal) {
    ExpandIcon = node.isOpen ? MdArrowDropDown : MdArrowRight;
  }
  console.log('Node:', node);
  // switch (node.data.treeType) {
  //   case 'topography':
  //     icon = '🗺️'; // Make Mountain Icon
  //     contextText = ` - ${node.data.id.slice(0, 7)}`;
  //     break;
  //   case 'overlay':
  //     icon = '📌'; // Make Layering Icon
  //     break;
  //   case 'placeable':
  //     icon = '📍';
  //     break;
  //   default:
  //     break;
  // }
  return (
    <div
      className="tree-node"
      title={tooltipText}
      style={style}
      ref={dragHandle}
      onClick={() => node.isInternal && node.toggle()}
    >
      <span>{ExpandIcon ? <ExpandIcon /> : undefined}</span>
      {icon}
      {node.data.name}
      <p className="context-small">{contextText}</p>
    </div>
  );
};

export default Node;
