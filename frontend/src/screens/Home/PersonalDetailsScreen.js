import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';

const PersonalDetailsScreen = () => {
  const [details, setDetails] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    goal: '',
    activity_level: '',
  });

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const { userID } = jwtDecode(token);
          const res = await axios.get(`${API_URL}/api/personalDetails/get`, {
            params: { user_id: userID },
          });
          setDetails(res.data);
        }
      } catch (error) {
        console.error('Error fetching personal details:', error);
      }
    };

    fetchPersonalDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Personal Details</Text>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{details.gender}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{details.age}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Weight (kg)</Text>
          <Text style={styles.value}>{details.weight}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Height (cm)</Text>
          <Text style={styles.value}>{details.height}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Goal</Text>
          <Text style={styles.value}>{details.goal}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Activity Level</Text>
          <Text style={styles.value}>{details.activity_level}</Text>
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

export default PersonalDetailsScreen;
