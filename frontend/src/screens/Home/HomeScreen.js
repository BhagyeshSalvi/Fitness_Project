import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import { useFocusEffect } from "@react-navigation/native";
import Swiper from 'react-native-swiper';
import * as Progress from 'react-native-progress';
const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const [firstname, setFirstname] = useState('');
  const [nutrition, setNutrition] = useState(null);
  const [consumed, setConsumed] = useState(null);
  const [workout, setTodayWorkout] = useState([]);
  const [activity, setActivity] = useState([]);


  const fetchHomeData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) return;
      const decodedToken = jwtDecode(token);
      setFirstname(decodedToken.firstname);
      const userId = decodedToken.userID;
      const today = new Date().toISOString().split("T")[0];

      // ✅ Nutrition API
      const nutritionResponse = await axios.get(`${API_URL}/api/nutrition/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNutrition(nutritionResponse.data.nutrition);

      const consumedResponse = await axios.get(`${API_URL}/api/food/summary/${userId}/${today}`);
      setConsumed(consumedResponse.data);

      // ✅ Workout API
      const workoutResponse = await axios.get(`${API_URL}/api/workout/recommend/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      extractTodayWorkout(workoutResponse.data.plan);

      // ✅ Activity API
      const activityResponse = await axios.get(`${API_URL}/api/activity/history`, {
        params: { user_id: userId, date: today },
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivity(activityResponse.data.activities || []);

    } catch (error) {
      console.error("❌ Error fetching home screen data:", error);
    }
  };

  // ✅ Extract Today’s Workout
  const extractTodayWorkout = (plan) => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    const todayKey = Object.keys(plan).find(key => key.toLowerCase().includes(today.toLowerCase()));
    setTodayWorkout(todayKey ? plan[todayKey] : []);
  };

  useFocusEffect(useCallback(() => { fetchHomeData(); }, []));

  // Calculate total calories burned
  const totalCaloriesBurned = activity.reduce((sum, a) => sum + (a.calories_burned || 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {firstname} 👋</Text>

      <View style={styles.carouselContainer}>
        <Swiper
          showsPagination
          autoplay
          autoplayTimeout={4}
          dotStyle={{ backgroundColor: '#666' }}
          activeDotStyle={{ backgroundColor: '#008080' }}
          paginationStyle={{ bottom: 50 }}
        >

          {/* ✅ CARD 1 - Nutrition Progress */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nutrition Progress</Text>
            {nutrition && consumed ? (
              <View style={styles.progressRow}>
                <Progress.Circle
                  size={130}
                  progress={(consumed.total_calories || 0) / (nutrition.calories || 1)}
                  color="#008080"
                  strokeCap="round"
                  showsText
                  textStyle={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}
                  formatText={() =>
                    `${Math.round((consumed.total_calories / nutrition.calories) * 100)}%`
                  }
                  thickness={8}
                />
                <View style={{ marginLeft: 20 }}>
                  <Text style={[styles.macroText, { color: '#FF6384' }]}>Protein: {consumed.total_protein}g / {nutrition.protein}g</Text>
                  <Text style={[styles.macroText, { color: '#36A2EB' }]}>Carbs: {consumed.total_carbs}g / {nutrition.carbs}g</Text>
                  <Text style={[styles.macroText, { color: '#4CAF50' }]}>Fats: {consumed.total_fats}g / {nutrition.fats}g</Text>
                  <Text style={[styles.macroText, { color: '#FFA726' }]}>Calories: {consumed.total_calories} / {nutrition.calories} kcal</Text>
                </View>

              </View>
            ) : (
              <Text style={styles.warningText}>No nutrition data</Text>
            )}
          </View>

          {/* ✅ CARD 2 - Today's Workout */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Workout</Text>
            {workout.length > 0 ? (
              workout.map((exercise, index) => (
                <Text key={index} style={styles.workoutText}>• {exercise}</Text>
              ))
            ) : (
              <Text style={styles.warningText}>Rest Day or No Workout Plan</Text>
            )}
          </View>

          {/* ✅ CARD 3 - Activity & Calories Burned */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today's Activity</Text>
            {activity.length > 0 ? (
              <>
                {activity.map((act, index) => (
                  <Text key={index} style={styles.activityText}>
                    • {act.activity_name} ({act.intensity}) - 🔥 {act.calories_burned} kcal
                  </Text>
                ))}
                <Text style={[styles.macroText, { marginTop: 10 }]}>Total Burned: 🔥 {totalCaloriesBurned} kcal</Text>
              </>
            ) : (
              <Text style={styles.warningText}>No activity logged</Text>
            )}
          </View>

        </Swiper>
      </View>

      {/* ✅ Calories In vs Calories Out Section */}
      <View style={styles.cicoContainer}>
        <Text style={styles.cicoTitle}>Calories In vs Calories Out</Text>
        {nutrition && consumed ? (
          <>
            <Text style={styles.cicoText}>🔥 Calories In (Consumed): {consumed.total_calories} kcal</Text>
            <Text style={styles.cicoText}>💪 Calories Out (Burned): {totalCaloriesBurned} kcal</Text>
            <Text style={styles.cicoText}>
              ⚖️ Net Calories: {(consumed.total_calories - totalCaloriesBurned).toFixed(1)} kcal
            </Text>
          </>
        ) : (
          <Text style={styles.warningText}>No calorie data available</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.tagline}>Believe. Be Better.</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', padding: 20, paddingTop: 50 },
  greeting: { fontSize: 34, color: '#008080', fontFamily: 'Ponomar-Regular', marginBottom: 20 },
  carouselContainer: { height: 300, borderRadius: 16, overflow: 'hidden' },

  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 10,
    width: screenWidth * 0.88,
    height: 220,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,  // Android shadow
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  cardTitle: { color: '#008080', fontSize: 26, textAlign: 'center', marginBottom: 10, fontFamily: 'Ponomar-Regular' },

  progressRow: { flexDirection: 'row', alignItems: 'center' },
  macroText: { color: '#CCCCCC', fontSize: 15, marginBottom: 5, fontFamily: 'Ponomar-Regular' },
  workoutText: { color: '#CCCCCC', fontSize: 18, marginBottom: 5, fontFamily: 'Ponomar-Regular' },
  activityText: { color: '#CCCCCC', fontSize: 18, marginBottom: 5, fontFamily: 'Ponomar-Regular' },

  warningText: { color: 'gray', fontSize: 14 },
  cicoContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cicoTitle: {
    color: '#008080',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Ponomar-Regular'
  },
  cicoText: {
    color: '#CCCCCC',
    fontSize: 18,
    marginBottom: 8,
    fontFamily: 'Ponomar-Regular'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  tagline: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: 16,
    fontStyle: 'italic',
  },

});

export default HomeScreen;
