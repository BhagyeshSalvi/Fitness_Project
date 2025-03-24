import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const WorkoutScreen = ({ navigation }) => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityHistory, setActivityHistory] = useState([]);

  useEffect(() => {
    fetchWorkout();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchActivityHistory();
    }, [])
  );
  

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

  const fetchActivityHistory = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const decodedToken = jwtDecode(token);
      const today = new Date().toISOString().split('T')[0];

      const response = await axios.get(`${API_URL}/api/activity/history`, {
        params: { user_id: decodedToken.userID, date: today },
        headers: { Authorization: `Bearer ${token}` }
      });

      setActivityHistory(response.data.activities);
    } catch (error) {
      console.error('❌ Error fetching activity history:', error);
    }
  };

  const getTodayWorkout = () => {
    if (!workoutPlan) return { exercises: [] };
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    const todayKey = Object.keys(workoutPlan).find((key) => key.toLowerCase().includes(today.toLowerCase()));
    const todayWorkout = todayKey ? workoutPlan[todayKey] : { exercises: [] };
    return todayWorkout;
  };

  const todayWorkout = getTodayWorkout();

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏋️ Today’s Workout</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : todayWorkout && Array.isArray(todayWorkout) && todayWorkout.length > 0 ? (
        <>
         
          {todayWorkout.map((exercise, index) => (
            <Text key={index} style={styles.exerciseText}>• {exercise}</Text>
          ))}
        </>
      ) : (
        <Text style={styles.restText}>🏖️ Rest Day - No workout today!</Text>
      )}

       {/* ✅ Activity History Table */}
       <View style={styles.activityTableContainer}>
        <Text style={styles.tableHeader}>Today's Activity Log</Text>
        

        {activityHistory.length === 0 ? (
          <Text style={styles.noActivity}>No activity logged today.</Text>
        ) : (
          <View>
            <View style={styles.divider} />
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Activity</Text>
              <Text style={styles.tableColHeader}>Intensity</Text>
              <Text style={styles.tableColHeader}>Kcal Burned</Text>
            </View>
            {activityHistory.map((activity, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCol}>{activity.activity_name}</Text>
                <Text style={styles.tableCol}>{activity.intensity}</Text>
                <Text style={styles.tableCol}>{activity.calories_burned} kcal</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ✅ Navigate to Log Activity */}
      <TouchableOpacity style={styles.logButton} onPress={() => navigation.navigate('LogActivityScreen')}>
        <Text style={styles.logButtonText}>+ Log New Activity</Text>
      </TouchableOpacity>

     
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#141414' },

  title: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: "#008080", 
    fontFamily: 'Ponomar-Regular' 
  },

  workoutType: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#FFFFFF',
    fontFamily: 'Ponomar-Regular' 
  },

  exerciseText: { 
    fontSize: 20, 
    marginBottom: 8, 
    color: "#FFFFFF", 
    fontFamily: 'Ponomar-Regular' 
  },  

  restText: { 
    fontSize: 20, 
    fontStyle: 'italic', 
    color: '#AAAAAA', 
    fontFamily: 'Ponomar-Regular' 
  },

  logButton: { 
    backgroundColor: '#008080', 
    padding: 13, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 30 
  },

  logButtonText: { 
    color: '#FFFFFF', 
    fontSize: 20, 
    fontWeight: 'bold', 
    fontFamily: 'Ponomar-Regular' 
  },


  activityTableContainer: { 
    marginTop: 30, 
    backgroundColor: '#1e1e1e', 
    padding: 16, 
    borderRadius: 16 
  },

  tableHeader: { 
    flex:1,
    textAlign: 'center',
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: '#FFFFFF', 
    fontFamily: 'Ponomar-Regular' 
  },

  tableRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12 
  },

  tableColHeader: { 
    flex: 1, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#008080', 
    fontFamily: 'Ponomar-Regular', 
    fontSize: 20, 
    
  },

  tableCol: { 
    flex: 1, 
    textAlign: 'center',
    fontSize: 16,  
    color: '#FFFFFF', 
    fontFamily: 'Ponomar-Regular' 
  },

  noActivity: { 
    textAlign: 'center', 
    color: '#AAAAAA', 
    fontStyle: 'italic', 
    fontFamily: 'Ponomar-Regular' 
  },

  caloriesBurned: {
    color: '#FFA726', 
    fontWeight: 'bold'
  },

  divider: {
    height: 1,
    backgroundColor: '#333333', // Slight gray line
    marginVertical:2,
  }
  
});

export default WorkoutScreen;
