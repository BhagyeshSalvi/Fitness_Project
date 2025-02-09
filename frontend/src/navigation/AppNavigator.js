import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import * as SecureStore from 'expo-secure-store';

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initial state is null (loading)

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      setIsAuthenticated(!!token); // Convert token to boolean (true if exists)
    };
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) return null; // Prevent flickering

  return (
    <NavigationContainer>
      {isAuthenticated ? <HomeStack setIsAuthenticated={setIsAuthenticated} /> : <AuthStack setIsAuthenticated={setIsAuthenticated} />}
    </NavigationContainer>
  );
};

export default AppNavigator;
