import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setQuestions, saveResponse } from './store';
import Home from './pages/Home';
import ErrorModal from './components/ErrorModal/ErrorModal';

function App() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');

  const fetchQuestions = async () => {
    // Reset error before every request
    setError(null);
    // Clear existing questions
    dispatch(setQuestions([]));

    // Enhanced URL validation (matches domain names ending in .com, .org, .ca, etc.)
    const urlPattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;

    // If the URL is invalid, show an error message
    if (!url || !urlPattern.test(url.trim())) {
      setError('Please enter a valid URL.');
      return;
    }

    // If the URL doesn't have a protocol, prepend "https://"
    const validUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    // Debugging: Log the URL being sent
    // console.log('URL being sent to backend:', validUrl);

    try {
      const response = await axios.post('http://localhost:5000/classify', {
        url: validUrl.trim(),
      });

      if (response.status === 200) {
        dispatch(setQuestions(response.data.questions));
      } else {
        setError(
          `Error: ${response.data.error || 'An unknown error occurred.'}`
        );
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError(
        `Failed to fetch questions: ${
          error.response?.data?.error || error.message || 'Unknown error'
        }`
      );
    }
  };

  const handleResponse = (question, response) => {
    dispatch(saveResponse({ question, response }));
  };

  const closeErrorModal = () => {
    setError(null);
  };

  return (
    <>
      <Home
        questions={questions}
        fetchQuestions={fetchQuestions}
        handleResponse={handleResponse}
        setUrl={setUrl}
        url={url} // Pass the URL state to Home (to sync URL across components)
        error={error}
        setError={setError}
        closeErrorModal={closeErrorModal}
      />

      {/* Error Modal */}
      {error && <ErrorModal message={error} onClose={closeErrorModal} />}
    </>
  );
}

export default App;
