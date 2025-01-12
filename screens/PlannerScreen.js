import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { fetchTrips, deleteTripItem } from '../features/tripSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getAuthUser } from '../AuthManager';
import { MaterialIcons } from '@expo/vector-icons';


const PlannerScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = getAuthUser();
  const { items, loading } = useSelector((state) => state.trips);

  // Navigate to the trip details page
  const handleCardPress = (trip) => {
    navigation.navigate('TripDetail', { trip });
  };

  // Navigate to the trip setup page
  const handleAddTrip = () => {
    navigation.navigate('TripSetup'); // Replace 'TripSetup' with the actual route name for the trip setup page
  };

  // Handle delete trip
  const handleDeleteTrip = (tripId) => {
    Alert.alert(
      "Delete Trip",
      "Are you sure you want to delete this trip?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(deleteTripItem(tripId)); // Dispatch action to delete the trip
          },
        },
      ]
    );
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchTrips(user.uid));
    }
  }, [dispatch, user]);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Trips</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
              <Text style={styles.cardTitle}>{item.tripName}</Text>
              <Text style={styles.cardDates}>
                {item.startDate} - {item.endDate}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => {
              handleDeleteTrip(item.id)
              }}>
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No trips found. Add your first trip!</Text>
        }
      />
      {/* Add Trip Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTrip}>
        <Text style={styles.addButtonText}>Add Trip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDates: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlannerScreen;