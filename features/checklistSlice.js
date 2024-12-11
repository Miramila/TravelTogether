import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addChecklistItemToFirebase,
  fetchChecklistFromFirebase,
  deleteChecklistItemFromFirebase,
  updateCheckboxStateInFirebase,
} from '../firebase';

// Async Thunk to fetch checklist items
export const fetchChecklist = createAsyncThunk('checklist/fetchChecklist', async () => {
  return await fetchChecklistFromFirebase();
});


// Checklist slice
const checklistSlice = createSlice({
  name: 'checklist',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    addChecklistItem(state, action) {
      state.items.push(action.payload);
      addChecklistItemToFirebase(action.payload); // Sync with Firebase
    },
    deleteChecklistItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      deleteChecklistItemFromFirebase(action.payload);
    },
    setChecklist(state, action) {
      state.items = action.payload;
    },
    updateCheckboxState(state, action) {
        const { itemId, userId, checked } = action.payload;
        const item = state.items.find((item) => item.id === itemId);
        if (item) {
          item.checkboxStates[userId] = checked;
        }
        console.log('Updating checkbox state:', itemId, userId, checked);
        updateCheckboxStateInFirebase(itemId, userId, checked);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChecklist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchChecklist.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addChecklistItem, deleteChecklistItem, setChecklist, updateCheckboxState } = checklistSlice.actions;
export default checklistSlice.reducer;