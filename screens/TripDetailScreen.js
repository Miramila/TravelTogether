import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../features/tripSlice';
import { getAuthUser } from '../AuthManager';
const TripDetailScreen = ({ route }) => {
  const tripId = route?.params?.trip?.id;
  const trip = useSelector((state) => state.trips.items.find((item) => item.id === tripId));

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = getAuthUser();

  // Ensure trips are fetched on screen focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        dispatch(fetchTrips());
      }
    }, [dispatch, user])
  );

  const handleAddInfo = (type) => {
    // Navigate to the AddInfo screen and refresh on return
    navigation.navigate('AddInfo', { trip, type });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Trip Details</Text>

      {/* Trip Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Summary</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Trip Name: </Text>
          {trip?.tripName || 'Not Provided'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Start Date: </Text>
          {trip?.startDate ? new Date(trip.startDate).toDateString() : 'Not Provided'}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>End Date: </Text>
          {trip?.endDate ? new Date(trip.endDate).toDateString() : 'Not Provided'}
        </Text>
      </View>

     {/* Flight Information Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Flight Information</Text>
  <Text style={styles.info}>
    <Text style={styles.label}>Origin: </Text>
    {trip?.origin || 'Not Provided'}
  </Text>
  <Text style={styles.info}>
    <Text style={styles.label}>Destination: </Text>
    {trip?.destination || 'Not Provided'}
  </Text>
  {/* Button to Add or Edit Flight Information */}
  <TouchableOpacity style={styles.addButton} onPress={() => handleAddInfo('flight')}>
    <Text style={styles.addButtonText}>
      {(!trip?.origin || !trip?.destination) ? 'Add Flight Information' : 'Edit Flight Information'}
    </Text>
  </TouchableOpacity>
</View>

{/* Hotel Information Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Hotel Information</Text>
  <Text style={styles.info}>
    <Text style={styles.label}>Hotel: </Text>
    {trip?.hotel || 'Not Provided'}
  </Text>
  {/* Button to Add or Edit Hotel Information */}
  <TouchableOpacity style={styles.addButton} onPress={() => handleAddInfo('hotel')}>
    <Text style={styles.addButtonText}>
      {!trip?.hotel ? 'Add Hotel Information' : 'Edit Hotel Information'}
    </Text>
  </TouchableOpacity>
</View>

{/* Tourist Attractions Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Tourist Attractions</Text>
  
  {trip?.touristAttractions && trip.touristAttractions.length > 0 ? (
    trip.touristAttractions.map((attraction, index) => (
      <View key={index} style={styles.attractionItem}>
        <Text style={styles.attractionName}>{attraction.name}</Text>
        <Text style={styles.activities}>{attraction.activities}</Text>
      </View>
    ))
  ) : (
    <Text style={styles.info}>No Tourist Attractions Added</Text>
  )}

  {/* Add Tourist Attractions Button */}
  <TouchableOpacity style={styles.addButton} onPress={() => handleAddInfo('touristAttractions')}>
    <Text style={styles.addButtonText}>Add Tourist Attractions</Text>
  </TouchableOpacity>
</View>

      {/* Footer */}
      <Text style={styles.footer}>
        Thank you for using the travel planner. Have a safe trip!
      </Text>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  label: {
    fontWeight: 'bold',
    color: '#000',
  },
  attractionItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  attractionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  activities: {
    fontSize: 14,
    color: '#555',
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default TripDetailScreen;