import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './app/store';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import TripDetailScreen from './screens/TripDetailScreen'
import TripSetupScreen from './screens/TripSetupScreen';
import PlannerScreen from './screens/PlannerScreen';
import AddInfoScreen from './screens/AddInfoScreen';
import HomeTabs from './screens/HomeScreen';
import WalletScreen from './screens/WalletScreen';


export default function App() {

  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Checklist" component={ChecklistScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="TripSetup" component={TripSetupScreen} />
          <Stack.Screen name="Planner" component={PlannerScreen} />
          <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
          <Stack.Screen name="TripDetail" component={TripDetailScreen}  />
          <Stack.Screen name="AddInfo" component={AddInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
