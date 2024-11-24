import styled from 'styled-components';

export const StyledHomeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

export const StyledParagraph = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  line-height: 1.5;
  padding: 10px 20px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover {
    background-color: #388e3c;
  }
`;
