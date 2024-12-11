import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChecklist,
  addChecklistItem,
  updateCheckboxState,
  deleteChecklistItem,
} from '../features/checklistSlice';
import { MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { getAuthUser } from '../AuthManager'; // Import auth functions
import { v4 as uuidv4 } from 'uuid';

const ChecklistScreen = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.checklist);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const user = getAuthUser();

  useEffect(() => {
   console.log('User:', user);
    if (user) {
      dispatch(fetchChecklist(user.uid));
    }
  }, [dispatch, user]);

  const handleAddItem = () => {
    if (user) {
      const newItem = {
        id: uuidv4(),
        name: itemName,
        checkboxStates: { [user.uid]: false },
      };
      dispatch(addChecklistItem(newItem));
      setModalVisible(false);
      setItemName('');
    }
  };

  const handleCheckboxToggle = (itemId, isChecked) => {
    if (user) {
      dispatch(updateCheckboxState({ itemId, userId: user.uid, checked: isChecked }));
    }
  };

  const handleDeleteItem = (itemId) => {
      dispatch(deleteChecklistItem(itemId));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Checkbox
              status={item.checkboxStates[user.uid] ? 'checked' : 'unchecked'}
              onPress={() =>
                handleCheckboxToggle(item.id, !item.checkboxStates[user.uid])
              }
            />
            <Text style={styles.itemName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Add Item"
        onPress={() => {
          setModalVisible(true);
          setItemName('');
        }}
      />

      {/* Modal for adding items */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAddItem}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
   container: {
     flex: 1,
     padding: 16,
     backgroundColor: '#fff',
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginBottom: 16,
   },
   itemContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: 16,
     borderBottomWidth: 1,
     borderBottomColor: '#ccc',
   },
   itemName: {
     fontSize: 18,
   },
   modalContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
     width: '80%',
     padding: 16,
     backgroundColor: '#fff',
     borderRadius: 8,
     shadowColor: '#000',
     shadowOpacity: 0.25,
     shadowRadius: 4,
     elevation: 5,
   },
   modalTitle: {
     fontSize: 20,
     fontWeight: 'bold',
     marginBottom: 16,
   },
   input: {
     borderWidth: 1,
     borderColor: '#ccc',
     padding: 8,
     borderRadius: 4,
     marginBottom: 16,
   },
   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
   },
   button: {
     flex: 1,
     padding: 12,
     backgroundColor: '#007BFF',
     borderRadius: 4,
     alignItems: 'center',
     marginHorizontal: 4,
   },
   buttonText: {
     color: '#fff',
     fontWeight: 'bold',
   },
   cancelButton: {
     backgroundColor: '#6c757d',
   },
 });

export default ChecklistScreen;
