import { FC } from 'react';
import styled from '@modern-js/runtime/styled';
import { DisplayTemplate } from '@shared/_types';
// import { metaDataIconStyle } from '../detailsPanel/styles';
import SvgIcon from '@/components/icon/svg';

interface TemplateElementProps {
  templateData: DisplayTemplate;
  isSelected?: boolean;
  onSelect?: (template: DisplayTemplate) => void;
}

const TemplateElement: FC<TemplateElementProps> = ({
  templateData,
  isSelected = false,
  onSelect,
}) => {
  // const markerStyle: CSSProperties = {
  //   fill: templateData.data.fillColor,
  //   stroke: templateData.data.lineColor,
  //   strokeWidth: templateData.data.lineWidth,
  // };

  const clickHandler = () => {
    onSelect?.(templateData);
  };

  return (
    <TemplateElementRow
      as={'div'}
      isSelected={isSelected}
      onClick={clickHandler}
    >
      <MapIconContainer>
        <SvgIcon
          src={templateData.imgSrc}
          alt={templateData.name}
          // style={{ ...metaDataIconStyle, ...markerStyle }}
        />
      </MapIconContainer>
      <Name>{templateData.name}</Name>
    </TemplateElementRow>
  );
};

export default TemplateElement;

const TemplateElementRow = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px;

  &:hover {
    background: #e0e0e0;
  }

  ${({ isSelected }) =>
    isSelected &&
    `
    border: 1px solid blue;
  `}
`;

const MapIconContainer = styled.div`
  width: 30px;
  height: 30px;
`;

const Name = styled.h2``;
