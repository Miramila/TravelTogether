import { configureStore } from '@reduxjs/toolkit';
import checklistReducer from '../features/checklistSlice';

const store = configureStore({
    reducer: {
      checklist: checklistReducer,
    },
  });

export default store;