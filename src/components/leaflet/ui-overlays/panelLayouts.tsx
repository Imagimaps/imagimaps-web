import { FC } from 'react';
import styled from '@modern-js/runtime/styled';

// import ControlBar from './panels/controlBar';
import ContentsPanel from './panels/contentsPanel';
import ContextMenu from './panels/contextMenu';

const PanelLayouts: FC = () => {
  return (
    <LayoutsOverlay>
      <PanelDockTop>{/* <ControlBar /> */}</PanelDockTop>
      <ContextMenu />
      <ContentsPanel />
    </LayoutsOverlay>
  );
};

export default PanelLayouts;

const LayoutsOverlay = styled.div`
  pointer-events: none;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
`;

const PanelDockTop = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;
