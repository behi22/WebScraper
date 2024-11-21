import { configureStore, createSlice } from '@reduxjs/toolkit';

const visitorSlice = createSlice({
  name: 'visitor',
  initialState: { questions: [], responses: {} },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    saveResponse: (state, action) => {
      const { question, response } = action.payload;
      state.responses[question] = response;
    },
  },
});

export const { setQuestions, saveResponse } = visitorSlice.actions;

const store = configureStore({
  reducer: visitorSlice.reducer,
});

export default store;
