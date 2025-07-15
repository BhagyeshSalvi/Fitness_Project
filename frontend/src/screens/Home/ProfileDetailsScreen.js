import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';

const ProfileDetailsScreen = () => {
  const [profile, setProfile] = useState({
    email: '',
    firstname: '',
    lastname: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const { userID } = jwtDecode(token);
          const res = await axios.get(`${API_URL}/api/auth/info/${userID}`);
          setProfile(res.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Profile</Text>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{profile.firstname}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{profile.lastname}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Ponomar-Regular',
    marginBottom: 24,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#888',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Ponomar-Regular',
    marginTop: 2,
  },
});

export default ProfileDetailsScreen;
