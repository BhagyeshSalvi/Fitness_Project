import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const HomeScreen = ({ setIsAuthenticated }) => {
  const handleLogout = async () => {
    console.log('Logout button pressed'); 
    await SecureStore.deleteItemAsync('userToken'); // Remove token
    console.log('Token deleted'); 
    setIsAuthenticated(false); // Update state to switch to AuthStack
    console.log('isAuthenticated set to false');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Burnix</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});

export default HomeScreen;
