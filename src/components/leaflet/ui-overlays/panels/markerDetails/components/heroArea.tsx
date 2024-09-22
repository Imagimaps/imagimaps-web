import styled from '@modern-js/runtime/styled';
import { DisplayTemplate } from '@shared/_types';
import { FC } from 'react';

interface HeroAreaProps {
  template?: DisplayTemplate;
}

const HeroArea: FC<HeroAreaProps> = ({ template }) => {
  return (
    <HeroAreaContainer>
      <TemplateIcon
        as="img"
        src={template?.iconData}
        width={template?.maxSize.width}
        height={template?.maxSize.height}
      />
    </HeroAreaContainer>
  );
};

export default HeroArea;

const HeroAreaContainer = styled.div`
  display: relative;
  display: flex;
  height: 200px;
  width: 100%;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyNjkiPjwvcmVjdD4KPGcgZmlsbD0iIzY0OTRiNyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMSIgeT0iMjAiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxIiB5PSI0MCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEiIHk9IjYwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMSIgeT0iODAiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMTAwIiB4PSIyMCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMDAiIHg9IjQwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEwMCIgeD0iNjAiPjwvcmVjdD4KPHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMTAwIiB4PSI4MCI+PC9yZWN0Pgo8L2c+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZT0iI2ZmZiI+PC9yZWN0Pgo8L3N2Zz4=');
  background-color: rgba(255, 255, 255, 0.5);
  background-blend-mode: multiply;
`;

const TemplateIcon = styled.img`
  display: block;
  margin: auto;
`;
