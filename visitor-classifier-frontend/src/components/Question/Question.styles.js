import styled from 'styled-components';

export const StyledQuestionCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const StyledOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const StyledOptionRadio = styled.label`
  display: block;
  position: relative;
  cursor: pointer;
  padding: 12px 20px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background-color: #fff;
  transition: all 0.3s ease;

  /* Highlight border when selected */
  ${({ selected }) =>
    selected &&
    `
      border-color: #4caf50;
      box-shadow: 0 0 5px #4caf50;
    `}

  &:hover {
    background-color: #f7f7f7;
    border-color: #bbb;
  }

  input {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border: 2px solid #ddd;
    border-radius: 50%;
    background: #fff;
    transition: all 0.3s ease;
  }

  /* Highlight circle when selected */
  ${({ selected }) =>
    selected &&
    `
      &::before {
        border-color: #4caf50;
        background: #4caf50;
      }
    `}
`;

export const StyledOptionText = styled.span`
  margin-left: 30px;
`;
