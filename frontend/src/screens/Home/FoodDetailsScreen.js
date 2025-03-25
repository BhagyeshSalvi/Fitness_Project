import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
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
        meal_type: mealType,
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
      <Text style={styles.brand}>Brand: {food.brand_name || "Generic"}</Text>

      <Text style={styles.label}>Portion Size ({food.unit}):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={portion.toString()}
        onChangeText={(value) => setPortion(parseFloat(value) || 0)}
      />

      <View style={styles.macrosContainer}>
        <Text style={styles.caloriesText}>Calories: {updatedMacros.calories} kcal</Text>
        <Text style={styles.proteinText}>Protein: {updatedMacros.protein} g</Text>
        <Text style={styles.carbsText}>Carbs: {updatedMacros.carbs} g</Text>
        <Text style={styles.fatsText}>Fats: {updatedMacros.fats} g</Text>
      </View>
      <TouchableOpacity style={styles.logButton} onPress={logFood}>
        <Text style={styles.logButtonText}>Add to Log</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#141414' },

  title: {
    fontSize: 30,
    color: '#008080',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Ponomar-Regular'
  },

  brand: {
    fontFamily: 'Ponomar-Regular',
    marginTop: 10,
    marginBottom: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  label: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    fontFamily: 'Ponomar-Regular'
  },

  input: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    padding: 7,
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: "center",
    fontFamily: 'Ponomar-Regular'
  },

  macrosContainer: {
    marginTop: 25,
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 12,
    borderColor: '#333',
    borderWidth:1
  },

  macroText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontFamily: 'Ponomar-Regular'
  },

  proteinText: { color: '#FF4081', fontSize: 16, fontFamily: 'Ponomar-Regular' },
  carbsText: { color: '#42A5F5', fontSize: 16, fontFamily: 'Ponomar-Regular' },
  fatsText: { color: '#66BB6A', fontSize: 16, fontFamily: 'Ponomar-Regular' },
  caloriesText: { color: '#FFA726', fontSize: 16, fontFamily: 'Ponomar-Regular' },

  logButton: {
    backgroundColor: '#008080',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30
  },

  logButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular'
  },

  brandText: {
    color: '#AAAAAA',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Ponomar-Regular'
  }
});


export default FoodDetailScreen;
