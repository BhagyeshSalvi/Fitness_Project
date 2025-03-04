import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import { Dimensions } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';

const HomeScreen = () => {
  const [firstname, setFirstname] = useState('');
  const [nutrition, setNutrition] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          setFirstname(decodedToken.firstname); // Extract firstname from the token

          // Fetch Nutrition Data
          const response = await axios.get(`${API_URL}/api/nutrition/${decodedToken.userID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNutrition(response.data.nutrition);
        }
      } catch (error) {
        console.error('Error fetching user/nutrition data:', error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {firstname}!</Text>
      {nutrition ? (
        <>
          <Text style={styles.subtitle}>{firstname} Macros</Text>
          <View style={styles.nutritionContainer}>
            {[
              { label: "Protein", value: nutrition.protein, goal: 144 },
              { label: "Carb", value: nutrition.carbs, goal: 453 },
              { label: "Fat", value: nutrition.fats, goal: 114 },
              { label: "kCal", value: nutrition.calories, goal: 3414 },
            ].map((item, index) => (
              <View key={index} style={styles.nutritionItem}>
                <ProgressCircle
                  style={styles.progressCircle}
                  progress={item.value / item.goal}
                  progressColor={item.label === "Protein" ? "#FF6384" : item.label === "Carb" ? "#36A2EB" : item.label === "Fat" ? "#FFCE56" : "#4CAF50"}
                />
                <Text style={styles.nutritionText}>{item.label}</Text>
                <Text style={styles.nutritionText}>{item.value} of {item.goal}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.warningText}>⚠️ No nutrition plan found. Set up your nutrition in the app.</Text>
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
  progressCircle: { height: 80, width: 80 },
  nutritionText: { fontSize: 14, marginTop: 5, textAlign: 'center' },
});

export default HomeScreen;
