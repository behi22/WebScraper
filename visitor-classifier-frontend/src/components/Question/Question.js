import React from 'react';
import {
  StyledQuestionCard,
  StyledOptionRadio,
  StyledOptionContainer,
  StyledOptionText,
} from './Question.styles';

const Question = ({
  questionId,
  question,
  options,
  onSelectAnswer,
  selectedAnswer,
  isMissing,
}) => (
  <StyledQuestionCard>
    <h3>{question}</h3>
    <StyledOptionContainer>
      {options.map((option) => (
        <StyledOptionRadio
          key={`${questionId}-${option}`}
          selected={selectedAnswer === option}
          onClick={() => onSelectAnswer(questionId, option)}
        >
          <input
            type="radio"
            name={`question-${questionId}`}
            value={option}
            checked={selectedAnswer === option}
            onChange={() => onSelectAnswer(questionId, option)}
          />
          <StyledOptionText>{option}</StyledOptionText>
        </StyledOptionRadio>
      ))}
    </StyledOptionContainer>
    {isMissing && (
      <span style={{ color: 'red', marginTop: '7px', display: 'block' }}>
        This question is required.
      </span>
    )}
  </StyledQuestionCard>
);

export default Question;
