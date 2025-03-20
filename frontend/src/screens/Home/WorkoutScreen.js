import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const WorkoutScreen = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Activity Log States
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');
  const [lastCalories, setLastCalories] = useState(null);
  const [lastActivityText, setLastActivityText] = useState('');

  // ✅ DropDown states
  const [openActivity, setOpenActivity] = useState(false);
  const [activityItems, setActivityItems] = useState([
    { label: 'Running', value: 'Running' },
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Treadmill', value: 'Treadmill' },
    { label: 'Stairmaster', value: 'Stairmaster' },
    { label: 'Jump Rope', value: 'Jump Rope' },
    { label: 'Weight Training', value: 'Weight Training' },
    { label: 'Swimming', value: 'Swimming' },
    { label: 'HIIT', value: 'HIIT' },
  ]);

  const [openIntensity, setOpenIntensity] = useState(false);
  const [intensityItems, setIntensityItems] = useState([
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Intense', value: 'intense' }
  ]);

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
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    const todayKey = Object.keys(workoutPlan).find((key) => key.toLowerCase().includes(today.toLowerCase()));
    const todayWorkout = todayKey ? workoutPlan[todayKey] : { exercises: [] };
    return todayWorkout;
  };

  const todayWorkout = getTodayWorkout();

  // ✅ Activity Log Handler
  const handleLogActivity = async () => {
    if (!selectedActivity || !duration || !intensity) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const decodedToken = jwtDecode(token);

      const response = await axios.post(`${API_URL}/api/activity/log`, {
        user_id: decodedToken.userID,
        activity_name: selectedActivity,
        duration_minutes: duration,
        intensity: intensity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLastCalories(response.data.calories_burned);
      const activityMsg = `🔥 You burned ${response.data.calories_burned} kcal doing ${selectedActivity} for ${duration} minutes!`;
      setLastActivityText(activityMsg);

      Alert.alert('Activity Logged ✅', activityMsg);
      setSelectedActivity('');
      setDuration('');
      setIntensity('');
    } catch (error) {
      console.error('❌ Error logging activity:', error);
      Alert.alert('Error', 'Failed to log activity. Please try again.');
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
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

      {/* ✅ Activity Logging Section */}
      <View style={styles.activityContainer}>
        <Text style={styles.activityTitle}>📋 Log an Activity</Text>

        {/* 🔥 Wrap in View with zIndex */}
        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={openActivity}
            value={selectedActivity}
            items={activityItems}
            setOpen={setOpenActivity}
            setValue={setSelectedActivity}
            setItems={setActivityItems}
            placeholder="Select Activity"
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: '#ccc' }}
            listMode="SCROLLVIEW"  
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Duration (minutes)"
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        <View style={{ zIndex: 2000 }}>
          <DropDownPicker
            open={openIntensity}
            value={intensity}
            items={intensityItems}
            setOpen={setOpenIntensity}
            setValue={setIntensity}
            setItems={setIntensityItems}
            placeholder="Select Intensity"
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: '#ccc' }}
            listMode="SCROLLVIEW"  
          />
        </View>

        <TouchableOpacity style={styles.logButton} onPress={handleLogActivity}>
          <Text style={styles.logButtonText}>Log Activity</Text>
        </TouchableOpacity>

        {lastCalories && (
          <Text style={styles.calorieText}>{lastActivityText}</Text>
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  workoutType: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  exerciseText: { fontSize: 18, marginBottom: 5 },
  restText: { fontSize: 20, fontStyle: 'italic', color: 'gray' },

  activityContainer: { padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginTop: 30 },
  activityTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  dropdown: { borderColor: '#ccc', marginBottom: 15, zIndex: 5000 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  logButton: { backgroundColor: '#008080', padding: 15, borderRadius: 8, alignItems: 'center' },
  logButtonText: { color: '#fff', fontSize: 16 },
  calorieText: { fontSize: 16, color: '#333', marginTop: 15, fontWeight: '600' }
});

export default WorkoutScreen;
