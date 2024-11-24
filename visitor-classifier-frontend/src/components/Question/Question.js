import React from 'react';
import { StyledQuestionCard, StyledOptionButton } from './Question.styles';

const Question = ({ question, options, handleResponse }) => (
  <StyledQuestionCard>
    <h3>{question}</h3>
    <div>
      {options.map((option, index) => (
        <StyledOptionButton
          key={index}
          onClick={() => handleResponse(question, option)}
        >
          {option}
        </StyledOptionButton>
      ))}
    </div>
  </StyledQuestionCard>
);

export default Question;
