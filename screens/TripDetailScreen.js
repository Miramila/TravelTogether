import React, { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrips } from "../features/tripSlice";
import { getAuthUser } from "../AuthManager";
import { MaterialIcons } from "@expo/vector-icons";
import { deleteTripActivityItem } from "../features/tripSlice";
import MapView, { Marker } from "react-native-maps";

const TripDetailScreen = ({ route }) => {
  const tripId = route?.params?.trip?.id;
  const trip = useSelector((state) =>
    state.trips.items.find((item) => item.id === tripId)
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = getAuthUser();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const mapRef = useRef(null); 

  // Ensure trips are fetched on screen focus
  useFocusEffect(
    useCallback(() => {
      if (user) {
        dispatch(fetchTrips());
      }
    }, [dispatch, user])
  );


  const handleAddInfo = (type) => {
    navigation.navigate("AddInfo", { trip, type });
  };

  const handleDeleteAttraction = (index) => {
    dispatch(deleteTripActivityItem({trip , index}))
    if (user) {
      dispatch(fetchTrips(user.uid));
    }
  }

  const handleViewAllLocations = () => {
    setIsMapVisible(true);
  };

  const handleCloseMap = () => {
    setIsMapVisible(false);
  };

  const fitMapSize = () => {
    if (
      isMapVisible &&
      trip?.touristAttractions?.length > 0 &&
      mapRef.current
    ) {
      const coordinates = trip.touristAttractions.map((location) => ({
        latitude: location.latitude,
        longitude: location.longitude,
      }));

      console.log("the coordinates are", coordinates);

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 20, right: 20, bottom: 20, left: 20 },
        animated: true,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
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
          {trip?.origin || "Not Provided"}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Destination: </Text>
          {trip?.destination || "Not Provided"}
        </Text>
        {/* Button to Add or Edit Flight Information */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddInfo("flight")}
        >
          <Text style={styles.addButtonText}>
            {!trip?.origin || !trip?.destination
              ? "Add Flight Information"
              : "Edit Flight Information"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hotel Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hotel Information</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Hotel: </Text>
          {trip?.hotel || "Not Provided"}
        </Text>
        {/* Button to Add or Edit Hotel Information */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddInfo("hotel")}
        >
          <Text style={styles.addButtonText}>
            {!trip?.hotel ? "Add Hotel Information" : "Edit Hotel Information"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tourist Attractions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tourist Attractions</Text>
        {trip?.touristAttractions && trip.touristAttractions.length > 0 ? (
          trip.touristAttractions.map((attraction, index) => (
            <View key={index} style={styles.attractionItem}>
              <View>
                <Text style={styles.attractionName}>{attraction.name}</Text>
                <Text style={styles.activities}>{attraction.activities}</Text>
              </View>

              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteAttraction(index)}
              >
                <MaterialIcons name="delete" size={24} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.info}>No Tourist Attractions Added</Text>
        )}

        {/* Add Tourist Attractions Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddInfo("touristAttractions")}
        >
          <Text style={styles.addButtonText}>Add Tourist Attractions</Text>
        </TouchableOpacity>

        {/* View All Saved Locations Button */}
        {trip?.touristAttractions && trip.touristAttractions.length > 0 && (
          <TouchableOpacity
            style={styles.viewMapButton}
            onPress={handleViewAllLocations}
          >
            <Text style={styles.viewMapButtonText}>View All on Map</Text>
          </TouchableOpacity>
        )}

        {/* Pop-Up Modal for Google Map */}
        <Modal
          visible={isMapVisible}
          animationType="slide"
          onRequestClose={handleCloseMap}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              showsUserLocation={true}
              initialRegion={{
                latitude: trip?.touristAttractions ? trip.touristAttractions[0]?.latitude : 37.7749,
                longitude: trip?.touristAttractions ? trip.touristAttractions[0].longitude : -122.4194,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {trip?.touristAttractions ? trip.touristAttractions.map((location, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={location.name}
                />
              )): null}
            </MapView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseMap}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.fitButton} onPress={fitMapSize}>
              <Text style={styles.fitButtonText}>Fit map</Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}></View>
          </View>
        </Modal>
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
    paddingTop: 50,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  attractionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  attractionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  activities: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  viewMapButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  viewMapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    right: 10,
    paddingRight: 5,
  },
  map: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#FF5733",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fitButton: {
    backgroundColor: "#007BFF", // Distinct blue color for the "Fit Map" button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    width: "40%",
  },
  fitButtonText: {
    color: "#fff", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});

export default TripDetailScreen;
