import styled from 'styled-components';

export const StyledInputContainer = styled.div`
  margin: 2rem 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

export const StyledInput = styled.input`
  padding: 0.8rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  width: 300px;
  font-size: 1rem;
`;

export const StyledButton = styled.button`
  padding: 0.8rem 1.2rem;
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #388e3c;
  }
`;
