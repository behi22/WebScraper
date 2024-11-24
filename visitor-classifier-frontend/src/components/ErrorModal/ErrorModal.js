import React from 'react';
import {
  StyledOverlay,
  StyledModalContent,
  StyledButton,
} from './ErrorModal.styles';

const ErrorModal = ({ message, onClose }) => {
  return (
    <StyledOverlay>
      <StyledModalContent>
        <h2>Error</h2>
        <p>{message}</p>
        <StyledButton onClick={onClose}>Close</StyledButton>
      </StyledModalContent>
    </StyledOverlay>
  );
};

export default ErrorModal;
