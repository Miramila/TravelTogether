import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocs, setDoc, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './Secrets';

let app;
if (getApps().length == 0) {
  app = initializeApp(firebaseConfig);
}
const db = getFirestore(app);

export const addChecklistItemToFirebase = async (item, userId) => {
  const docRef = doc(collection(db, "checklist"), item.id);
  await setDoc(docRef, {
    ...item,
  });
  return { ...item, id: item.id };
};

export const fetchChecklistFromFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'checklist')); // Fetch all documents in the 'checklist' collection
      const checklistItems = [];
      querySnapshot.forEach((doc) => {
        checklistItems.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      console.log('Checklist fetched from Firebase:', checklistItems);
      return checklistItems;
    } catch (error) {
      console.error('Error fetching checklist:', error);
      throw error;
    }
  };

export const deleteChecklistItemFromFirebase = async (id) => {
  const docRef = doc(db, 'checklist', id);
  await deleteDoc(docRef);
  console.log('Checklist item deleted from Firebase:', id);
};

export const updateCheckboxStateInFirebase = async (itemId, userId, checked) => {
    const docRef = doc(db, 'checklist', itemId);
    await updateDoc(docRef, {
      [`checkboxStates.${userId}`]: checked,
    });
};

export const addTripItemToFirebase = async (item) => {
  console.log("it's the add trip item to firebase")
  const docRef = doc(collection(db, "trips"), item.id);
  await setDoc(docRef, {
    ...item,
  });
  return { ...item, id: item.id };
}

export const updateTripItemInFirebase = async (trip, type, formData) => {
  const docRef = doc(db, 'trips', trip.id); // Ensure 'trips' matches your Firebase collection name

  console.log("the form data is", formData)
  // Prepare the fields to update based on the type
  let updates;

  if (type === 'flight') {
    updates={
      origin: formData.origin,
      destination: formData.destination
    }
  } else if (type === 'hotel') {
    updates={
      hotel: formData.hotel
    }
  } else if (type === 'touristAttractions') {
    updates = {
      touristAttractions: trip.touristAttractions
        ? [...trip.touristAttractions, formData] // Create a new array with the added attraction
        : [formData], // Initialize as a new array if it doesn't exist
    };
  } else {
    throw new Error('Invalid update type');
  }
  // Update the document in Firebase
  try {
    await updateDoc(docRef, updates);
    console.log(`Trip updated successfully: ${trip.id}`, updates);
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

export const deleteTripItemFromFirebase = async (id) => {
    const docRef = doc(db, 'trips', id);
    await deleteDoc(docRef);
    console.log('Trip deleted from Firebase:', id);
}

export const deleteTripActivityItemFromFirebase = async (trip, id) =>{
  const docRef = doc(db, 'trips', trip.id); 
  const updates = {touristAttractions : trip.touristAttractions.filter((_, i) => i !== id)};
  await updateDoc(docRef, updates);
}

export const fetchTripsFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'trips')); // Fetch all documents in the 'trips' collection
    const tripItems = [];
    querySnapshot.forEach((doc) => {
      tripItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    console.log('Trips fetched from Firebase:', tripItems);
    return tripItems;
  } catch (error) {
    console.error('Error fetching Trip:', error);
    throw error;
  }
};

export const hasTrips = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'trips')); // Fetch all documents in the 'trips' collection
    return !querySnapshot.empty; // Returns true if there are trips, false otherwise
  } catch (error) {
    console.error('Error checking trips:', error);
    throw error;
  }
};

export const fetchBudgetFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'budget'));
    const budgetItems = [];
    querySnapshot.forEach((doc) => {
      budgetItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    console.log('Budget fetched from Firebase:', budgetItems);
    return budgetItems;
  } catch (error) {
    console.error('Error fetching budget:', error);
    throw error;
  }
}

export const addBudgetItemToFirebase = async (item) => {
  const docRef = doc(collection(db, "budget"), item.id);
  await setDoc(docRef, {
    ...item,
  });
  return { ...item, id: item.id };
};

export const deleteBudgetItemFromFirebase = async (id) => {
  const docRef = doc(db, 'budget', id);
  await deleteDoc(docRef);
  console.log('Budget item deleted from Firebase:', id);
};
