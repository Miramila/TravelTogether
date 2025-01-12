import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { addTripItem } from "../features/tripSlice";
import { useDispatch, useSelector } from "react-redux";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { GOOGLE_API_KEY } from "../Secrets";

const TripSetupScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [tripName, setTripName] = useState("");
  const [selectedDates, setSelectedDates] = useState({
    startDate: "",
    endDate: "",
  });
  const [location, setLocation] = useState(null)
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  

  const onDayPress = (day) => {
    const { startDate, endDate } = selectedDates;

    if (!startDate || (startDate && endDate)) {
      // Set the start date when none is selected or both dates are already selected
      setSelectedDates({ startDate: day.dateString, endDate: "" });
    } else {
      // Set the end date when the start date is already selected
      if (new Date(day.dateString) >= new Date(startDate)) {
        setSelectedDates({ ...selectedDates, endDate: day.dateString });
      } else {
        // If the selected end date is before the start date, reset
        setSelectedDates({ startDate: day.dateString, endDate: "" });
      }
    }
  };

  const renderMarkedDates = () => {
    const { startDate, endDate } = selectedDates;
    const markedDates = {};

    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: "#50C878",
        textColor: "white",
      };
    }

    if (endDate) {
      let currentDate = new Date(startDate);
      const stopDate = new Date(endDate);

      while (currentDate <= stopDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        markedDates[dateStr] = {
          color: "#D3F3D8",
          textColor: "black",
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }

      markedDates[endDate] = {
        endingDay: true,
        color: "#50C878",
        textColor: "white",
      };
    }

    return markedDates;
  };

  const handleNext = () => {
    if (!tripName.trim()) {
      alert("Please enter a trip name.");
      return;
    }
    if (!destination.trim()) {
      alert("Please enter a trip destination.");
      return;
    }
    if (!selectedDates.startDate || !selectedDates.endDate) {
      alert("Please select a valid date range.");
      return;
    }

    const newTrip = {
      id: uuidv4(),
      tripName: tripName,
      startDate: selectedDates.startDate,
      endDate: selectedDates.endDate,
      destination: destination,
      latitude: location.lat,
      longitude: location.lng
    };

    console.log(newTrip);
    dispatch(addTripItem(newTrip));

    navigation.replace("HomeTabs", {
      screen: "Planner",
      params: {
        tripName,
        startDate: selectedDates.startDate,
        endDate: selectedDates.endDate,
      },
    });
  };

  // Fetch auto-complete suggestions
  const fetchSuggestions = async (input) => {
    const APIurl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&types=(cities)&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(APIurl);
      const data = await response.json();

      if (data.status === "OK") {
        const results = data.predictions.map((item) => ({
          id: item.place_id,
          description: item.description,
        }));
        console.log("the result is", results);
        setSuggestions(results);
      } else {
        console.error("Failed to fetch suggestions:", data.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  // Fetch latitude and longitude for the selected destination
  const handleDestinationSelect = async (description) => {
    setDestination(description);
    setSuggestions([])

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(description)}&components=country:us&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(geocodeUrl);
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        setLocation(location)
      } else {
        console.error('Failed to fetch location:', data.status);
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Set Up Your Trip</Text>

      {/* Trip Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Trip Name (e.g., Summer Vacation)"
        value={tripName}
        onChangeText={setTripName}
      />

      {/* Trip Destination Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Trip Destination"
        value={destination}
        onChangeText={(text) => {
          setDestination(text);
          fetchSuggestions(text);
        }}
      />

      {/* FlatList for Suggestions */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleDestinationSelect(item.description)}
            >
              <Text style={styles.suggestion}>{item.description}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}

      {/* Calendar for Date Range Selection */}
      <Text style={styles.subHeader}>Pick Your Travel Dates</Text>
      <Calendar
        markingType={"period"}
        markedDates={renderMarkedDates()}
        onDayPress={onDayPress}
        theme={{
          selectedDayBackgroundColor: "#50C878",
          todayTextColor: "#50C878",
          arrowColor: "#50C878",
        }}
      />

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setSelectedDates({ startDate: "", endDate: "" })}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    zIndex: 2,
  },
  suggestionsList: {
    position: "absolute", 
    top: 210, 
    left: 20, 
    right: 20, 
    backgroundColor: "#fff", 
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    zIndex: 3, 
    maxHeight: 200, 
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: "#50C878",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default TripSetupScreen;
