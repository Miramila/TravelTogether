import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import PlannerScreen from "./PlannerScreen"
import ChecklistScreen from "./ChecklistScreen";
import WalletScreen from "./WalletScreen";

// Individual Tab Screens
// function PlannerScreen() {
//     return (
//       <View style={styles.screenContainer}>
//         <Text style={styles.screenText}>Planner Screen</Text>
//       </View>
//     );
//   }
  
  
  // function ChecklistScreen() {
  //   return (
  //     <View style={styles.screenContainer}>
  //       <Text style={styles.screenText}>Checklist Screen</Text>
  //     </View>
  //   );
  // }

  // Logout Button at Top-Right
function LogoutButton({ navigation }) {
    return (
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace('Login')}
      >
        <Ionicons name="log-out-outline" size={24} color="black" />
      </TouchableOpacity>
    );
  }

  // Bottom Tab Navigator
const Tab = createBottomTabNavigator();


export default function HomeTabs({ navigation }) {
    return (
      <View style={{ flex: 1 }}>
        {/* Logout Button */}
        <LogoutButton navigation={navigation} />
  
        {/* Bottom Tabs */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
  
              if (route.name === 'Planner') {
                iconName = 'calendar-outline';
              } else if (route.name === 'Wallet') {
                iconName = 'wallet-outline';
              } else if (route.name === 'Checklist') {
                iconName = 'checkbox-outline';
              }
  
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'green',
            tabBarInactiveTintColor: 'gray',
          })}
        >
         <Tab.Screen name="Planner" component={PlannerScreen} />
          <Tab.Screen name="Wallet" component={WalletScreen} />
          <Tab.Screen name="Checklist" component={ChecklistScreen} />
        </Tab.Navigator>
      </View>
    );
  }

// function HomeScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>
//         <Text style={styles.loginHeaderText}>
//           Welcome to your tailored travel planner!
//         </Text>
//         {getAuthUser().displayName}!
//       </Text>
//       <Button
//         onPress={async () => {
//           try {
//             await signOut();
//             navigation.navigate("Login");
//           } catch (error) {
//             Alert.alert("Sign Out Error", error.message, [{ text: "OK" }]);
//           }
//         }}
//       >
//         Now sign out!
//       </Button>
//     </View>
//   );
// }


const styles = StyleSheet.create({
    logoutButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 1,
    },
    screenContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    screenText: {
      fontSize: 18,
      color: 'black',
    },
  });


// export default HomeScreen;