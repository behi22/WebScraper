import styled from 'styled-components';

export const StyledQuestionCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const StyledOptionButton = styled.button`
  margin: 0.5rem 0.5rem 0 0;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #388e3c;
  }
`;
