import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setQuestions, saveResponse } from './store';

function App() {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.questions);
  const [url, setUrl] = useState('');

  const fetchQuestions = async () => {
    try {
      if (!url) {
        alert('Please enter a valid URL.');
        return;
      }

      // debug
      console.log('URL being sent:', url);

      const response = await axios.post('http://localhost:5000/classify', {
        url: url.trim(),
      });

      if (response.status === 200) {
        dispatch(setQuestions(response.data.questions));
      } else {
        alert(`Error: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert(
        `Failed to fetch questions: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleResponse = (question, response) => {
    dispatch(saveResponse({ question, response }));
  };

  return (
    <div className="App">
      <h1>Visitor Classification</h1>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter website URL"
      />
      <button onClick={fetchQuestions}>Fetch Questions</button>

      <div>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={index}>
              <h3>{q.question}</h3>
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleResponse(q.question, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ))
        ) : (
          <p>No questions available. Enter a URL to generate questions.</p>
        )}
      </div>
    </div>
  );
}

export default App;
