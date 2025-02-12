import React from 'react';
import { createStackNavigator   } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import PersonalDetailsScreen from '../screens/Onboarding/PersonalDetailsScreen';
import NutritionRecommendationScreen from '../screens/Onboarding/NutritionRecommendationScreen';

const Stack = createStackNavigator();

const AuthStack = ({ setIsAuthenticated }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="NutritionRecommendation">
    {(props) => (
        <NutritionRecommendationScreen
            {...props}
            setIsAuthenticated={setIsAuthenticated}
        />
    )}
</Stack.Screen>


    </Stack.Navigator>
  );
};

export default AuthStack;
