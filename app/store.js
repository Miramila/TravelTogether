import { configureStore, combineReducers } from '@reduxjs/toolkit';
import checklistReducer from '../features/checklistSlice';
import tripsReducer  from '../features/tripSlice'

const rootReducer = combineReducers({
  checklist: checklistReducer,
  trips: tripsReducer

})

const store = configureStore({
    reducer: rootReducer
  });


export default store;