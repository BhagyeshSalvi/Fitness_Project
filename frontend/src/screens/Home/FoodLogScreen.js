import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@env";
import { useNavigation, useFocusEffect } from "@react-navigation/native";


const FoodLogScreen = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [foodLogs, setFoodLogs] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.userID);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLoggedFood();
    }
  }, [userId]);

  const fetchLoggedFood = async () => {
    try {
      const date = new Date().toISOString().split("T")[0]; // Current Date
      const response = await axios.get(`${API_URL}/api/food/${userId}/${date}`);
      setFoodLogs(response.data);
    } catch (error) {
      console.error("Error fetching food logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchLoggedFood();
      }
    }, [])
  );

  const renderMealSection = (mealType, title) => (
    <View style={styles.mealContainer}>
      <Text style={styles.mealTitle}>{title}</Text>
      <FlatList
        data={foodLogs[mealType]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.foodItem}>
            {item.food_name} - {item.calories} kcal
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.noFoodText}>No food logged.</Text>}
      />
      <Button
        title={`Add Food to ${title}`}
        onPress={() => navigation.navigate("FoodSearchScreen", { mealType })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍽️ Food Log</Text>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <>
          {renderMealSection("breakfast", "Breakfast")}
          {renderMealSection("lunch", "Lunch")}
          {renderMealSection("dinner", "Dinner")}
          {renderMealSection("snack", "Snacks")}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  mealContainer: { marginBottom: 20 },
  mealTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  foodItem: { fontSize: 16, marginVertical: 5 },
  noFoodText: { fontSize: 14, color: "gray", fontStyle: "italic" },
});

export default FoodLogScreen;
