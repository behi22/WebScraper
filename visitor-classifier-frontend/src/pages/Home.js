import React from 'react';
import Header from '../components/Header/Header';
import UrlInput from '../components/UrlInput/UrlInput';
import Question from '../components/Question/Question';
import { StyledHomeContainer, StyledParagraph } from './Home.styles';

const Home = ({ questions, fetchQuestions, handleResponse, setUrl, url }) => (
  <StyledHomeContainer>
    <Header />
    <UrlInput
      fetchQuestions={fetchQuestions}
      setUrl={setUrl}
      url={url} // Pass the current URL to UrlInput
    />
    <div>
      {questions.length > 0 ? (
        questions.map((q, index) => (
          <Question
            key={index}
            question={q.question}
            options={q.options}
            handleResponse={handleResponse}
          />
        ))
      ) : (
        <StyledParagraph>
          No questions available. Please Enter a Valid URL to generate
          questions.
        </StyledParagraph>
      )}
    </div>
  </StyledHomeContainer>
);

export default Home;
