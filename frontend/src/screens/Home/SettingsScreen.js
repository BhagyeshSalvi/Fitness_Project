import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode'; // ✅ token decode
import axios from 'axios';
import { API_URL } from '@env';

const SettingsScreen = ({ setIsAuthenticated }) => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    firstname: '',
    lastname: '',
  });

  const [personalDetails, setPersonalDetails] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    goal: '',
    activity_level: '',
  });

  useEffect(() => {
    const fetchAllInfo = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const { userID } = jwtDecode(token); // ✅ decoding userID
          
          // User Info
          const userRes = await axios.get(`${API_URL}/api/auth/info/${userID}`);
          const { email, firstname, lastname } = userRes.data;
          setUserInfo({ email, firstname, lastname });

          // Personal Details
          const detailsRes = await axios.get(`${API_URL}/api/personalDetails/get`, {
            params: { user_id: userID },
          });
          setPersonalDetails(detailsRes.data);
        }
      } catch (error) {
        console.error('❌ Error fetching settings data:', error);
      }
    };

    fetchAllInfo();
  }, []);

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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>⚙️ Settings</Text>

        <View style={styles.infoCard}>
          <Text style={styles.sectionHeader}>Account Info</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userInfo.email}</Text>

          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{userInfo.firstname}</Text>

          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{userInfo.lastname}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionHeader}>Personal Details</Text>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{personalDetails.gender}</Text>

          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{personalDetails.age}</Text>

          <Text style={styles.label}>Weight (kg)</Text>
          <Text style={styles.value}>{personalDetails.weight}</Text>

          <Text style={styles.label}>Height (cm)</Text>
          <Text style={styles.value}>{personalDetails.height}</Text>

          <Text style={styles.label}>Goal</Text>
          <Text style={styles.value}>{personalDetails.goal}</Text>

          <Text style={styles.label}>Activity Level</Text>
          <Text style={styles.value}>{personalDetails.activity_level}</Text>
        </View>
      </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Ponomar-Regular',
    marginBottom: 24,
    alignSelf: 'center',
  },
  infoCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'Ponomar-Regular',
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Ponomar-Regular',
    marginTop: 2,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
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
