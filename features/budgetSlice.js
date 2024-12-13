import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBudgetFromFirebase, addBudgetItemToFirebase, deleteBudgetItemFromFirebase } from '../firebase';

export const fetchBudget = createAsyncThunk('budget/fetchBudget', async () => {
    return await fetchBudgetFromFirebase();
  });

const budgetSlice = createSlice({
  name: 'budget',
  initialState: {
    items: [],
    totalSpent: 0,
    expectedCost: 0,
  },
  reducers: {
    addBudget: (state, action) => {
      state.items.push(action.payload);
      state.totalSpent += action.payload.cost;
      addBudgetItemToFirebase(action.payload);
    },
    deleteBudget: (state, action) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload);
      if (itemIndex !== -1) {
        state.totalSpent -= state.items[itemIndex].cost;
        state.items.splice(itemIndex, 1);
      }
      deleteBudgetItemFromFirebase(action.payload);
    },
    setExpectedCost: (state, action) => {
      state.expectedCost = action.payload;
    },
  },
});

export const { addBudget, deleteBudget, setExpectedCost } = budgetSlice.actions;

export default budgetSlice.reducer;
