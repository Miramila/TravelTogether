import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateTripInfo } from '../features/tripSlice'; 
import { useNavigation } from '@react-navigation/native';


const AddInfoScreen = ({ route }) => {
  const {trip, type}  = route.params; // Get tripId and type from navigation params
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
//   const trip = useSelector((state) => state.trips.items.find((item) => item.id === tripId));

  // State for the input fields
  const [formData, setFormData] = useState(() => {
    if (type === 'flight') {
      return {
        origin: trip?.origin || '',
        destination: trip?.destination || '',
      };
    } else if (type === 'hotel') {
      return {
        hotel: trip?.hotel || '',
      };
    } else if (type === 'touristAttractions') {
      return {
        name: '',
        activities: '',
      };
    }
    return {};
  });

  const handleSave = () => {

    if (type === 'flight' && (!formData.origin || !formData.destination)) {
      Alert.alert('Error', 'Please fill out both Origin and Destination.');
      return;
    }

    if (type === 'hotel' && !formData.hotel) {
      Alert.alert('Error', 'Please fill out the Hotel field.');
      return;
    }

    if (type === 'touristAttractions' && (!formData.name || !formData.activities)) {
      Alert.alert('Error', 'Please fill out both Name and Activities.');
      return;
    }

    console.log("trip, type, formData is ", trip, type, formData)
    // Dispatch the update action
    dispatch(updateTripInfo({ trip , type, formData }));

    Alert.alert('Success', 'Information updated successfully.');
    navigation.goBack(); // Navigate back to the TripDetailScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {type === 'flight'
          ? 'Edit Flight Information'
          : type === 'hotel'
          ? 'Edit Hotel Information'
          : 'Add Tourist Attraction'}
      </Text>

      {type === 'flight' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Origin"
            value={formData.origin}
            onChangeText={(text) => setFormData({ ...formData, origin: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Destination"
            value={formData.destination}
            onChangeText={(text) => setFormData({ ...formData, destination: text })}
          />
        </>
      )}

      {type === 'hotel' && (
        <TextInput
          style={styles.input}
          placeholder="Enter Hotel Name"
          value={formData.hotel}
          onChangeText={(text) => setFormData({ ...formData, hotel: text })}
        />
      )}

      {type === 'touristAttractions' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Attraction Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Activities"
            value={formData.activities}
            onChangeText={(text) => setFormData({ ...formData, activities: text })}
          />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddInfoScreen;