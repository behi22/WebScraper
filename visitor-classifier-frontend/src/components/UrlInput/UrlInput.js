import React from 'react';
import {
  StyledInputContainer,
  StyledInput,
  StyledButton,
} from './UrlInput.styles';

const UrlInput = ({ fetchQuestions, setUrl, url, setError }) => {
  const handleFetch = () => {
    if (url.trim()) {
      setUrl(url); // Update the URL in the parent component
      fetchQuestions(); // Call fetchQuestions to fetch the data
    } else {
      setError('Please enter a valid URL.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetch(); // Trigger fetch when Enter key is pressed
    }
  };

  return (
    <StyledInputContainer>
      <StyledInput
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
        onKeyDown={handleKeyPress} // Listen for Enter key press
      />
      <StyledButton onClick={handleFetch}>Fetch Questions</StyledButton>
    </StyledInputContainer>
  );
};

export default UrlInput;
