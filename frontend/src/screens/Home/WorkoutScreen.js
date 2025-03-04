import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';

const WorkoutScreen = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          const response = await axios.get(`${API_URL}/api/workout/recommend/${decodedToken.userID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setWorkoutPlan(response.data.plan);

        }
      } catch (error) {
        console.error('Error fetching workout plan:', error);
        Alert.alert('Error', 'Could not load workout plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, []);

  const getTodayWorkout = () => {
    if (!workoutPlan) return { exercises: [] };

    const today = new Date().toLocaleString('en-US', { weekday: 'long' }); // e.g., "Tuesday"
   
    const todayKey = Object.keys(workoutPlan).find((key) => key.toLowerCase().includes(today.toLowerCase()));

    const todayWorkout = todayKey ? workoutPlan[todayKey] : { exercises: [] };

    return todayWorkout;
};




  const todayWorkout = getTodayWorkout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️ Today’s Workout</Text>
  
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : todayWorkout && Array.isArray(todayWorkout) && todayWorkout.length > 0 ? (
        <>
          <Text style={styles.workoutType}>🔥 Workout Type: {workoutPlan.split}</Text>
          {todayWorkout.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>• {exercise}</Text>
          ))}
        </>
      ) : (
        <Text style={styles.restText}>🏖️ Rest Day - No workout today!</Text>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  workoutType: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  exerciseText: { fontSize: 18, marginBottom: 5 },
  restText: { fontSize: 20, fontStyle: 'italic', color: 'gray' },
});

export default WorkoutScreen;
