import React from 'react';
import {
  StyledInputContainer,
  StyledInput,
  StyledButton,
} from './UrlInput.styles';

const UrlInput = ({ fetchQuestions, setUrl, url }) => {
  const handleFetch = () => {
    if (url.trim()) {
      setUrl(url); // Update the URL in the parent component
      fetchQuestions(); // Call fetchQuestions to fetch the data
    } else {
      alert('Please enter a valid URL.');
    }
  };

  return (
    <StyledInputContainer>
      <StyledInput
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
      />
      <StyledButton onClick={handleFetch}>Fetch Questions</StyledButton>
    </StyledInputContainer>
  );
};

export default UrlInput;
