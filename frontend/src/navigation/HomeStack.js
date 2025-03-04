import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import WorkoutScreen from '../screens/Home/WorkoutScreen';
import SettingsScreen from '../screens/Home/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const HomeStack = ({setIsAuthenticated}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Workout') iconName = 'barbell';
          else if (route.name === 'Settings') iconName = 'settings';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
      <Tab.Screen name="Settings">
  {(props) => <SettingsScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
</Tab.Screen>

    </Tab.Navigator>
  );
};

export default HomeStack;
