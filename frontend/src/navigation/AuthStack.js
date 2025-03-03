import React from 'react';
import { createStackNavigator   } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import PersonalDetailsScreen from '../screens/Onboarding/PersonalDetailsScreen';
import NutritionRecommendationScreen from '../screens/Onboarding/NutritionRecommendationScreen';
import WorkoutSelectionScreen from '../screens/Onboarding/WorkoutSelectionScreen';
import WorkoutRecommendationScreen from '../screens/Onboarding/WorkoutRecommendationScreen';

const Stack = createStackNavigator();

const AuthStack = ({ setIsAuthenticated }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="NutritionRecommendation" component={NutritionRecommendationScreen} />
     <Stack.Screen name="WorkoutSelection" component={WorkoutSelectionScreen} />
      <Stack.Screen name="WorkoutRecommendation">
        {(props) => <WorkoutRecommendationScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>



    </Stack.Navigator>
  );
};

export default AuthStack;
