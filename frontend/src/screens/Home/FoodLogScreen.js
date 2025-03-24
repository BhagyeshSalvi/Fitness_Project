import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@env";
import * as Progress from "react-native-progress";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const FoodLogScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [nutritionGoals, setNutritionGoals] = useState(null);
  const [consumedNutrition, setConsumedNutrition] = useState(null);
  const [foodLogs, setFoodLogs] = useState({ breakfast: [], lunch: [], dinner: [], snack: [] });
  const [loading, setLoading] = useState(true);
  const [expandedMeals, setExpandedMeals] = useState({ breakfast: true, lunch: true, dinner: true, snack: true });

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) return;

      const decodedToken = jwtDecode(token);
      setFirstName(decodedToken.firstname);
      const userId = decodedToken.userID;
      setUserId(userId);

      const nutritionResponse = await axios.get(`${API_URL}/api/nutrition/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNutritionGoals(nutritionResponse.data.nutrition);

      const today = new Date().toISOString().split("T")[0];
      const consumedResponse = await axios.get(`${API_URL}/api/food/summary/${userId}/${today}`);
      setConsumedNutrition(consumedResponse.data);

      const logsResponse = await axios.get(`${API_URL}/api/food/${userId}/${today}`);
      setFoodLogs(logsResponse.data);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const toggleExpand = (mealType) => {
    setExpandedMeals(prev => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  const handleDeleteFood = async (foodId, userId, date) => {
    try {
      const formattedDate = date.split('T')[0];
      await axios.delete(`${API_URL}/api/food/delete`, {
        data: {
          userId: userId,
          foodId: foodId,
          date: formattedDate,
        },
      });
      fetchData(); // Refresh logs after delete
    } catch (error) {
      console.error("❌ Delete error:", error);
    }
  };

  const renderMealSection = (mealType, title) => {
    const mealData = foodLogs[mealType] || [];
    const totalCalories = mealData.reduce((sum, item) => sum + item.calories, 0);
    const totalProtein = mealData.reduce((sum, item) => sum + item.protein, 0);
    const totalCarbs = mealData.reduce((sum, item) => sum + item.carbs, 0);
    const totalFats = mealData.reduce((sum, item) => sum + item.fats, 0);

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeaderRow}>
          <TouchableOpacity onPress={() => toggleExpand(mealType)}>
            <Text style={styles.mealTitle}>{expandedMeals[mealType] ? "▼" : "▶"} {title}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('FoodSearchScreen', { mealType })}>
            <Text style={styles.addButton}>➕ Add Food</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.macroRow}>
          <View style={styles.macroBadge}><Text style={styles.proteinLabel}>Protein</Text><Text style={styles.macroValue}>{Math.round(totalProtein)}g</Text></View>
          <View style={styles.macroBadge}><Text style={styles.carbsLabel}>Carbs</Text><Text style={styles.macroValue}>{Math.round(totalCarbs)}g</Text></View>
          <View style={styles.macroBadge}><Text style={styles.fatLabel}>Fat</Text><Text style={styles.macroValue}>{Math.round(totalFats)}g</Text></View>
          <View style={styles.macroBadge}><Text style={styles.kcalLabel}>kCal</Text><Text style={styles.macroValue}>{Math.round(totalCalories)}</Text></View>
        </View>

        {expandedMeals[mealType] && (
          mealData.length > 0 ? mealData.map((item) => (
            <View key={item.id} style={styles.foodItem}>
              <Text style={styles.foodText}>{item.food_name} ({item.brand_name})</Text>
              <Text style={styles.servingText}>{item.serving_size} {item.unit}</Text>
              <View style={styles.macroRow}>
                <Text style={styles.proteinLabel}>P {Math.round(item.protein)}g</Text>
                <Text style={styles.carbsLabel}>C {Math.round(item.carbs)}g</Text>
                <Text style={styles.fatLabel}>F {Math.round(item.fats)}g</Text>
                <Text style={styles.kcalLabel}>🔥 {Math.round(item.calories)}</Text>
              </View>
              <Text
                style={styles.deleteText}
                onPress={() => handleDeleteFood(item.id, userId, item.date)}
              >
                🗑 Delete
              </Text>
            </View>
          )) : <Text style={styles.noFood}>No food logged.</Text>
        )}

      </View>
    );
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#008080" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>{firstName}'s Macros</Text>
      {nutritionGoals && consumedNutrition ? (
        <View style={styles.progressContainer}>
          {[
            { label: "Protein", value: consumedNutrition.total_protein || 0, goal: nutritionGoals.protein || 1, color: "#FF4081" },
            { label: "Carbs", value: consumedNutrition.total_carbs || 0, goal: nutritionGoals.carbs || 1, color: "#42A5F5" },
            { label: "Fats", value: consumedNutrition.total_fats || 0, goal: nutritionGoals.fats || 1, color: "#66BB6A" },
            { label: "Calories", value: consumedNutrition.total_calories || 0, goal: nutritionGoals.calories || 1, color: "#FFA726" },
          ].map((item, index) => (
            <View key={index} style={styles.progressItem}>
              <Progress.Circle size={65} progress={item.value / item.goal} color={item.color} thickness={5} showsText formatText={() => `${Math.round((item.value / item.goal) * 100)}%`} />
              <Text style={styles.macroLabel}>{item.label}</Text>
              <Text style={styles.macroText}>{Math.round(item.value)} / {Math.round(item.goal)}g</Text>
            </View>
          ))}
        </View>
      ) : <Text style={styles.warningText}>⚠️ No nutrition data available.</Text>}

      {renderMealSection("breakfast", "Breakfast")}
      {renderMealSection("lunch", "Lunch")}
      {renderMealSection("dinner", "Dinner")}
      {renderMealSection("snack", "Snacks")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414", padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#141414" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#008080", textAlign: "center", marginBottom: 20, fontFamily: 'Ponomar-Regular' },
  progressContainer: { flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" },
  progressItem: { alignItems: "center", margin: 10 },
  macroLabel: { fontSize: 18, color: "#FFFFFF", fontWeight: "bold", marginTop: 3, fontFamily: 'Ponomar-Regular' },
  macroText: { fontSize: 12, color: "#CCCCCC" },
  warningText: { color: "#FFA726", textAlign: "center", fontSize: 16 },
  mealCard: { backgroundColor: "#1e1e1e", borderRadius: 16, padding: 14, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 8 },
  mealHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', fontFamily: 'Ponomar-Regular' },

  macroRow: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 7, padding: 3 },
  macroBadge: { alignItems: 'center' },

  proteinLabel: { color: '#FF4081', fontWeight: 'bold', fontSize: 16, fontFamily: 'Ponomar-Regular' },
  carbsLabel: { color: '#42A5F5', fontWeight: 'bold', fontSize: 16, fontFamily: 'Ponomar-Regular' },
  fatLabel: { color: '#66BB6A', fontWeight: 'bold', fontSize: 16, fontFamily: 'Ponomar-Regular' },
  kcalLabel: { color: '#FFA726', fontWeight: 'bold', fontSize: 16, fontFamily: 'Ponomar-Regular' },

  macroValue: { color: '#FFFFFF', fontSize: 20, marginTop: -2, fontFamily: 'Ponomar-Regular' },


  foodItem: { backgroundColor: "#2a2a2a", padding: 8, borderRadius: 8, marginBottom: 8 },
  foodText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold", fontFamily: 'Ponomar-Regular' },
  servingText: { fontSize: 12, color: "#AAAAAA", marginBottom: 5 },
  noFood: { fontSize: 13, color: "gray", fontStyle: "bold", fontFamily: 'Ponomar-Regular' },
  addButton: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: 'Ponomar-Regular'
  },
  deleteText: {
    color: "#FF4C4C",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: 'right',
    marginTop: 8,
    fontFamily: 'Ponomar-Regular',
  },
  

});

export default FoodLogScreen;
