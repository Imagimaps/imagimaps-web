import styled from '@modern-js/runtime/styled';

export const editIconStyle = {
  width: '0.8rem',
  height: '0.8rem',
  marginLeft: '0.5rem',
  cursor: 'pointer',
};

export const metaDataIconStyle = {
  width: '1rem',
  height: '1rem',
  marginRight: '0.5rem',
};

export const ContentRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.5rem;
  /* justify-content: space-between; */
`;

export const Metadata = styled.p`
  font-size: 1rem;
  line-height: 1.25rem;
  font-weight: 400;
  color: #424649f7;
`;

export const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-left: 0.5rem;
`;
