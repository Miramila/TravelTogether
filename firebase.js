import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDocs, setDoc, collection, query, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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

// Delete an item from the checklist
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
