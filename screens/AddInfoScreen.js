import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import { useDispatch } from "react-redux";
import { updateTripInfo } from "../features/tripSlice";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'; 

import { GOOGLE_API_KEY } from "../Secrets";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";

const AddInfoScreen = ({ route }) => {
  const { trip, type } = route.params; // Get tripId and type from navigation params
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const initRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const initCamera = {
    center: {
      latitude: 40.749933,
      longitude: -73.98633,
    },
    // Only when using Google Maps.
    zoom: 7,
  };

  const [location, setLocation] = useState(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [mapRegion, setMapRegion] = useState(initRegion);
  const [camera, setCamera] = useState(initCamera);
  const [place, setPlace] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  let unsubscribeFromLocation = null;

  // Fetch auto-complete suggestions
  const fetchAutoComplete = async () => {
    const APIurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${search}&location=${trip.latitude},${trip.longitude}&radius=50000&components=country:us&types=establishment&key=${GOOGLE_API_KEY}`;
    fetch(APIurl)
      .then((response) => {
        console.log("response is good");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const results = data.predictions.map((item) => ({
          id: item.place_id,
          name: item.description,
        }));
        console.log("the suggestions are", results);
        setSuggestions(results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Get the detailed information for the selected place
  const handleSuggestionSelect = (placeId) => {
    const APIurl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;

    fetch(APIurl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const location = data.result.geometry.location;
        setCamera({
          ...camera,
          center: { latitude: location.lat, longitude: location.lng },
          zoom: 15,
        });

        const placeNew = {
          id: placeId,
          name: data.result.name,
          latitude: location.lat,
          longitude: location.lng,
        };

        setPlace(placeNew);
        setFormData({
          ...formData,
          location: placeNew.name,
          latitude: placeNew.latitude,
          longitude: placeNew.longitude,
        });
        setSuggestions([]);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchAutoComplete();
  }, [search]);

  const subscribeToLocation = async () => {
    let { status } = await requestForegroundPermissionsAsync();
    setPermissionsGranted(status === "granted");

    if (unsubscribeFromLocation) {
      unsubscribeFromLocation();
    }
    unsubscribeFromLocation = watchPositionAsync({}, (location) => {
      console.log("received update:", location);
      setLocation(location);
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    });
  };

  useEffect(() => {
    subscribeToLocation();
  }, []);

  // State for the input fields
  const [formData, setFormData] = useState(() => {
    if (type === "flight") {
      return {
        origin: trip?.origin || "",
        destination: trip?.destination || "",
      };
    } else if (type === "hotel") {
      return {
        hotel: trip?.hotel || "",
      };
    } else if (type === "touristAttractions") {
      return {
        name: "",
        activities: "",
        location: "",
        latitude: "",
        longitude: "",
      };
    }
    return {};
  });

  const handleSave = () => {
    if (type === "flight" && (!formData.origin || !formData.destination)) {
      Alert.alert("Error", "Please fill out both Origin and Destination.");
      return;
    }

    if (type === "hotel" && !formData.hotel) {
      Alert.alert("Error", "Please fill out the Hotel field.");
      return;
    }

    if (
      type === "touristAttractions" &&
      (!formData.name || !formData.activities)
    ) {
      Alert.alert("Error", "Please fill out both Name and Activities.");
      return;
    }

    // Dispatch the update action
    dispatch(updateTripInfo({ trip, type, formData }));
    Alert.alert("Success", "Information updated successfully.");
    navigation.goBack(); // Navigate back to the TripDetailScreen
  };

  const handleClearInput = () => {
    setSearch('');
    setPlace('')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {type === "flight"
          ? "Edit Flight Information"
          : type === "hotel"
          ? "Edit Hotel Information"
          : "Add Tourist Attraction"}
      </Text>

      {type === "flight" && (
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
            onChangeText={(text) =>
              setFormData({ ...formData, destination: text })
            }
          />
        </>
      )}

      {type === "hotel" && (
        <TextInput
          style={styles.input}
          placeholder="Enter Hotel Name"
          value={formData.hotel}
          onChangeText={(text) => setFormData({ ...formData, hotel: text })}
        />
      )}

      {type === "touristAttractions" && (
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
            onChangeText={(text) =>
              setFormData({ ...formData, activities: text })
            }
          />
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputLocation}
            placeholder="Search for a location"
            value={place.name}
            onChangeText={(text) => {
              setSearch(text);
            }}
          />
          {search.length > 0 && (
        <TouchableOpacity onPress={handleClearInput} style={styles.clearButton}>
          <MaterialIcons name="clear" size={20} color="#666" />
        </TouchableOpacity>
      )}
      </View>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSuggestionSelect(item.id)}>
                <Text style={styles.suggestion}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsList}
          />
          <MapView
            style={styles.map}
            // provider={PROVIDER_GOOGLE} // remove if on IOS and running with EXPO
            // region={mapRegion}
            camera={camera}
            showsUserLocation={true}
          >
            {place && (
              <Marker
                coordinate={{
                  latitude: place.latitude,
                  longitude: place.longitude,
                }}
                title={place.name}
              />
            )}
          </MapView>
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
    backgroundColor: "#f5f5f5",
    paddingTop: 50
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
  },
  inputLocation: {
    flex: 1,
    fontSize: 16,
    padding: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  clearButton: {
    marginLeft: 5,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  paragraph: {
    fontSize: 24,
  },
  suggestionsList: {
    position: "absolute",
    top: 270,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 3,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  map: {
    flex: 0.5,
    width: "100%",
    height: "100%",
    marginBottom: 20,
    zIndex: 1,
  },
});

export default AddInfoScreen;