import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.tagline}>Believe. Be Better.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    fontFamily: 'Ponomar-Regular',
  },
  logoutButton: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Ponomar-Regular',

  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  tagline: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default SettingsScreen;
