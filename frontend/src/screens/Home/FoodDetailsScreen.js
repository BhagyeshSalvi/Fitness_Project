import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_URL } from "@env";

const FoodDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { food, mealType } = route.params || {}; // Get food details and meal type

  const [userId, setUserId] = useState(null); // Store user ID from token
  const [portion, setPortion] = useState(food.serving_size);
  const portionFactor = portion / food.serving_size;

  // Recalculate macros based on portion size change
  const updatedMacros = {
    calories: (food.calories * portionFactor).toFixed(1),
    protein: (food.protein * portionFactor).toFixed(1),
    carbs: (food.carbs * portionFactor).toFixed(1),
    fats: (food.fats * portionFactor).toFixed(1),
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.userID); // Extract user ID from token
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    getUserId();
  }, []);

  const logFood = async () => {
    if (!userId) {
      console.error("User ID not available.");
      return;
    }

    try {
      const date = new Date().toISOString().split("T")[0];

      await axios.post(`${API_URL}/api/food/log`, {
        user_id: userId,
        meal_type: mealType ,
        food_name: food.food_name,
        brand_name: food.brand_name || "Generic",
        portion,
        unit: food.unit,
        calories: parseFloat(updatedMacros.calories),
        protein: parseFloat(updatedMacros.protein),
        carbs: parseFloat(updatedMacros.carbs),
        fats: parseFloat(updatedMacros.fats),
      });
      

      navigation.navigate("FoodLogScreen"); // Go back to food log after logging
    } catch (error) {
      console.error("❌ Error logging food:", error.response?.status, error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{food.food_name}</Text>
      <Text>Brand: {food.brand_name || "Generic"}</Text>

      <Text style={styles.label}>Portion Size ({food.unit}):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={portion.toString()}
        onChangeText={(value) => setPortion(parseFloat(value) || 0)}
      />

      <View style={styles.macrosContainer}>
        <Text>Calories: {updatedMacros.calories} kcal</Text>
        <Text>Protein: {updatedMacros.protein} g</Text>
        <Text>Carbs: {updatedMacros.carbs} g</Text>
        <Text>Fats: {updatedMacros.fats} g</Text>
      </View>

      <Button title="Add to Log" onPress={logFood} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  label: { fontSize: 18, marginTop: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10, textAlign: "center" },
  macrosContainer: { marginTop: 10 },
});

export default FoodDetailScreen;
