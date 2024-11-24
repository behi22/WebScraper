import React, { useState } from 'react';
import Header from '../components/Header/Header';
import UrlInput from '../components/UrlInput/UrlInput';
import Question from '../components/Question/Question';
import ErrorModal from '../components/ErrorModal/ErrorModal';
import Footer from '../components/Footer/Footer';
import {
  StyledHomeContainer,
  StyledParagraph,
  StyledButton,
} from './Home.styles';

const Home = ({
  questions,
  fetchQuestions,
  setUrl,
  url,
  error,
  setError,
  closeErrorModal,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [missingAnswers, setMissingAnswers] = useState([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [isFirstAttempt, setIsFirstAttempt] = useState(true);

  const handleSelectAnswer = (questionId, answer) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [questionId]: answer,
      };
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const unanswered = questions
      .filter(
        (q) =>
          !selectedAnswers[q.questionId] || selectedAnswers[q.questionId] === ''
      )
      .map((q) => q.questionId);

    if (unanswered.length > 0) {
      setMissingAnswers(unanswered);
      if (isFirstAttempt) {
        setIsFirstAttempt(false);
      }
      return;
    }

    // If all answers are selected, proceed to submit
    setSubmitted(true);
    setMissingAnswers([]); // Clear missing answers
    setShowQuestions(false); // Hide questions after submission

    // Submit answers to the backend (for future development)
    // questions.forEach((q) => {
    //   handleResponse(q, selectedAnswers[q.questionId]);
    // });
  };

  const handleUrlChange = (newUrl) => {
    setUrl(newUrl);

    // Reset the state when URL changes, if form is submitted
    if (submitted) {
      setSelectedAnswers({});
      setSubmitted(false);
      setMissingAnswers([]);
      setShowQuestions(true);
      setIsFirstAttempt(true);
    }
  };

  return (
    <StyledHomeContainer>
      <Header />
      <UrlInput
        fetchQuestions={fetchQuestions}
        setUrl={handleUrlChange}
        url={url} // Pass the current URL to UrlInput
        setError={(message) => setError(message)}
      />
      <div>
        {questions.length > 0 && showQuestions ? (
          questions.map((q) => (
            <Question
              key={q.questionId}
              questionId={q.questionId}
              question={q.question}
              options={q.options}
              onSelectAnswer={handleSelectAnswer}
              selectedAnswer={selectedAnswers[q.questionId]}
              isMissing={missingAnswers.includes(q.questionId)}
            />
          ))
        ) : (
          <StyledParagraph>
            No questions available. Please enter a valid URL to generate
            questions.
          </StyledParagraph>
        )}
      </div>

      {/* Error message for missing answers */}
      {missingAnswers.length > 0 && !isFirstAttempt && (
        <StyledParagraph style={{ color: 'red' }}>
          Please answer all the questions before submitting!
        </StyledParagraph>
      )}

      {/* Submit button */}
      {questions.length > 0 && !submitted && (
        <StyledButton onClick={handleSubmit}>Submit</StyledButton>
      )}

      {/* Success message */}
      {submitted && (
        <StyledParagraph style={{ color: 'green' }}>
          Your answers were submitted successfully!
        </StyledParagraph>
      )}

      {/* Display Error Modal if there's an error */}
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
      <Footer />
    </StyledHomeContainer>
  );
};

export default Home;
