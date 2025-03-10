import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import { Dimensions } from 'react-native';
import * as Progress from 'react-native-progress';
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const [firstname, setFirstname] = useState('');
  const [nutrition, setNutrition] = useState(null); // Total nutrition goals
  const [consumed, setConsumed] = useState(null); // Today's consumed nutrition
  const screenWidth = Dimensions.get("window").width;

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) return;

      const decodedToken = jwtDecode(token);
      setFirstname(decodedToken.firstname);
      const userId = decodedToken.userID;

      // Fetch Nutrition Goals
      const nutritionResponse = await axios.get(`${API_URL}/api/nutrition/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNutrition(nutritionResponse.data.nutrition);

      // Fetch Today's Consumed Nutrition
      const today = new Date().toISOString().split("T")[0];
      const consumedResponse = await axios.get(`${API_URL}/api/food/summary/${userId}/${today}`);
      setConsumed(consumedResponse.data);
    } catch (error) {
      console.error("❌ Error refreshing home screen data:", error);
    }
  };

  // ✅ Use `useFocusEffect` correctly
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {firstname}!</Text>

      {nutrition && consumed ? (
        <>
          <Text style={styles.subtitle}>{firstname}'s Nutrition Progress</Text>
          <View style={styles.nutritionContainer}>
            {[
              { label: "Protein", value: consumed.total_protein || 0, goal: nutrition.protein || 1, color: "#FF6384" },
              { label: "Carb", value: consumed.total_carbs || 0, goal: nutrition.carbs || 1, color: "#36A2EB" },
              { label: "Fat", value: consumed.total_fats || 0, goal: nutrition.fats || 1, color: "#FFCE56" },
              { label: "kCal", value: consumed.total_calories || 0, goal: nutrition.calories || 1, color: "#4CAF50" },
            ].map((item, index) => (
              <View key={index} style={styles.nutritionItem}>
                <Progress.Circle
                  size={80}
                  progress={item.goal ? item.value / item.goal : 0} // Avoid division by zero
                  color={item.color}
                  thickness={6}
                  showsText
                  formatText={() => `${Math.round((item.value / item.goal) * 100)}%`}
                />
                <Text style={styles.nutritionText}>{item.label}</Text>
                <Text style={styles.nutritionText}>{item.value} of {item.goal}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.warningText}>⚠️ No nutrition plan or food logs found for today.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 20, marginBottom: 10 },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  warningText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 10 },
  nutritionContainer: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
  nutritionItem: { alignItems: 'center', margin: 10 },
  nutritionText: { fontSize: 14, marginTop: 5, textAlign: 'center' },
});

export default HomeScreen;
