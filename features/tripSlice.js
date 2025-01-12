import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addTripItemToFirebase,
  fetchTripsFromFirebase,
  hasTrips,
  updateTripItemInFirebase,
  deleteTripItemFromFirebase,
  deleteTripActivityItemFromFirebase
} from '../firebase';

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
    console.log("fetch trip ...")
    return await fetchTripsFromFirebase();
});

export const checkHasTrips = createAsyncThunk('trips/checkHasTrips', async () => {
  console.log("Checking if trips exist...");
  return await hasTrips();
});

const tripsSlice = createSlice({
    name: 'trips',
    hasTrips: false,
    initialState: {
      items: [],
      loading: false,
      isInitialized: false
    },
    reducers: {
      addTripItem(state, action) {
        state.items.push(action.payload);
        addTripItemToFirebase(action.payload);
      },
      updateTripInfo(state, action){
        const {trip, type, formData} = action.payload
        updateTripItemInFirebase(trip, type, formData)
      },
      deleteTripItem(state, action) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        deleteTripItemFromFirebase(action.payload);
      },

      deleteTripActivityItem(state, action) {
        const {trip, index} = action.payload
        deleteTripActivityItemFromFirebase(trip, index)

      }


  },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTrips.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchTrips.fulfilled, (state, action) => {
          state.items = action.payload;
          state.hasTrips = action.payload.length > 0;
          state.loading = false;
        })
        .addCase(fetchTrips.rejected, (state) => {
          state.loading = false;
        })
        .addCase(checkHasTrips.fulfilled, (state, action) => {
          state.hasTrips = action.payload; 
          state.isInitialized = true; 
        });
        ;
    },
  });


export const {addTripItem, updateTripInfo, deleteTripItem, deleteTripActivityItem}= tripsSlice.actions;
export default tripsSlice.reducer;