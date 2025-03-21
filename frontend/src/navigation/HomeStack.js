import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home/HomeScreen";
import WorkoutScreen from "../screens/Home/WorkoutScreen";
import SettingsScreen from "../screens/Home/SettingsScreen";
import FoodLogScreen from "../screens/Home/FoodLogScreen";
import FoodSearchScreen from "../screens/Home/FoodSearchScreen";
import FoodDetailScreen from "../screens/Home/FoodDetailsScreen";
import LogActivityScreen from "../screens/Home/LogActivityScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


// Stack Navigator for Home, including Food Screens
const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FoodLogScreen" component={FoodLogScreen} />
      <Stack.Screen name="FoodSearchScreen" component={FoodSearchScreen} />
      <Stack.Screen name="FoodDetailsScreen" component={FoodDetailScreen} />
    </Stack.Navigator>
  );
};

// Stack Navigator for Workout
const WorkoutStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
      <Stack.Screen name="LogActivityScreen" component={LogActivityScreen} />
    </Stack.Navigator>
  );
};

// ✅ Bottom Tab Navigation
const HomeStack = ({ setIsAuthenticated }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Food Log") iconName = "nutrition";
          else if (route.name === "Workout") iconName = "barbell";
          else if (route.name === "Settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Food Log" component={HomeStackNavigator} /> 
      <Tab.Screen name="Workout" component={WorkoutStackNavigator} />
      <Tab.Screen name="Settings">
        {(props) => <SettingsScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default HomeStack;
