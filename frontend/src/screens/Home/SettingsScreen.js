import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen = ({ setIsAuthenticated }) => {
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken'); // Remove token
      setIsAuthenticated(false); // Update state to switch to AuthStack
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
});

export default SettingsScreen;
