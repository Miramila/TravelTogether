import { configureStore, combineReducers } from '@reduxjs/toolkit';
import checklistReducer from '../features/checklistSlice';
import tripsReducer  from '../features/tripSlice';
import budgetReducer from '../features/budgetSlice';

const rootReducer = combineReducers({
  checklist: checklistReducer,
  trips: tripsReducer,
  budget: budgetReducer
})

const store = configureStore({
    reducer: rootReducer
  });


export default store;