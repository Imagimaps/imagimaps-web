// import { FC } from 'react';
// import {
//   FaHand,
//   FaLocationPin,
//   FaBug,
//   FaLayerGroup,
//   FaLock,
//   FaLockOpen,
// } from 'react-icons/fa6';
// import { GiPauseButton, GiPlayButton } from 'react-icons/gi';
// import { useModel } from '@modern-js/runtime/model';
// import styled from '@modern-js/runtime/styled';

// import controlBarModel, { ControlMode } from './model/controlBar';

// const ControlBar: FC = () => {
//   const [state, controls] = useModel(controlBarModel);

//   return (
//     <ControlBarPanel>
//       <ButtonGroup>
//         <IconButton>
//           <GiPlayButton
//             className="icon-button"
//             style={{ border: state.run ? '1px solid black' : 'none' }}
//             onClick={() => controls.runApp()}
//           />
//         </IconButton>
//         <IconButton>
//           <GiPauseButton
//             className="icon-button"
//             style={{ border: !state.run ? '1px solid black' : 'none' }}
//             onClick={() => controls.stopApp()}
//           />
//         </IconButton>
//         <span> | </span>
//         <IconButton>
//           <FaHand
//             className="icon-button"
//             style={{
//               border:
//                 state.mode === ControlMode.Move ? '1px solid black' : 'none',
//             }}
//             onClick={() => controls.setMode(ControlMode.Move)}
//           />
//         </IconButton>
//         <IconButton>
//           <FaLocationPin
//             className="icon-button"
//             style={{
//               border:
//                 state.mode === ControlMode.Select ? '1px solid black' : 'none',
//             }}
//             onClick={() => controls.setMode(ControlMode.Select)}
//           />
//         </IconButton>
//         <span> | </span>
//         <IconButton>
//           <FaBug
//             className="icon-button"
//             style={{ border: state.debug ? '1px solid black' : 'none' }}
//             onClick={() =>
//               state.debug ? controls.hideDebugInfo() : controls.showDebugInfo()
//             }
//           />
//         </IconButton>
//         <IconButton>
//           <FaLayerGroup />
//         </IconButton>
//         <span> | </span>
//         <IconButton>
//           <FaLock />
//         </IconButton>
//         <IconButton>
//           <FaLockOpen />
//         </IconButton>
//       </ButtonGroup>
//     </ControlBarPanel>
//   );
// };

// export default ControlBar;

// const ControlBarPanel = styled.div`
//   pointer-events: all;
//   background-color: beige;
//   display: flex;
//   align-items: center;
//   justify-content: space-evenly;
//   border-radius: 2px;
// `;

// const ButtonGroup = styled.div`
//   padding: 5px 10px;
//   display: flex;
//   align-items: center;
//   justify-content: space-evenly;
//   gap: 5px;
// `;

// const IconButton = styled.div`
//   width: 20px;
//   height: 20px;
// `;
