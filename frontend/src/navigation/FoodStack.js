import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FoodLogScreen from '../screens/Home/FoodLogScreen';
import FoodSearchScreen from '../screens/Home/FoodSearchScreen';
import FoodDetailsScreen from '../screens/Home/FoodDetailsScreen';

const FoodStack = createStackNavigator();

const FoodStackNavigator = () => {
  return (
    <FoodStack.Navigator screenOptions={{ headerShown: false }}>
      <FoodStack.Screen name="FoodLogScreen" component={FoodLogScreen} />
      <FoodStack.Screen name="FoodSearchScreen" component={FoodSearchScreen} />
      <FoodStack.Screen name="FoodDetailsScreen" component={FoodDetailsScreen} />
    </FoodStack.Navigator>
  );
};

export default FoodStackNavigator;
