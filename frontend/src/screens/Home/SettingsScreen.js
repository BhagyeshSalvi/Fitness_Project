import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation, setIsAuthenticated }) => {
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      setIsAuthenticated(false);
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('❌ Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const settingsOptions = [
    {
      id: '1',
      label: 'Profile',
      icon: 'person-outline',
      navigateTo: 'ProfileDetails',
    },
    {
      id: '2',
      label: 'Personal Details',
      icon: 'body-outline',
      navigateTo: 'PersonalDetails',
    },
    {
      id: '3',
      label: 'Change Password',
      icon: 'key-outline',
      navigateTo: 'ChangePassword',
    },
    {
      id: '4',
      label: 'Food History',
      icon: 'calendar-outline',
      navigateTo: 'FoodHistoryScreen',
    },
    {
    id: '5',
    label: 'Notification Preferences',
    icon: 'notifications-outline',
    navigateTo: 'NotificationSettings',
  },
    
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate(item.navigateTo)}
          >
            <View style={styles.row}>
              <Ionicons name={item.icon} size={24} color="#008080" />
              <Text style={styles.optionText}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.tagline}>Believe. Be Better.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', paddingHorizontal: 20, paddingTop: 80 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Ponomar-Regular',
    marginBottom: 30,
    alignSelf: 'center',
  },
  optionCard: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  optionText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 15,
    fontFamily: 'Ponomar-Regular',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
    fontWeight: 'bold',
  },
  tagline: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 15,
    fontFamily: 'Ponomar-Regular',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SettingsScreen;
