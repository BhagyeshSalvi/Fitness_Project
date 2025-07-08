import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import { jwtDecode } from 'jwt-decode';

const NutritionRecommendationScreen = ({ route, navigation }) => {
  const { gender, weight, height, age, activityLevel, goal } = route.params;

  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const response = await axios.post(`${API_URL}/api/nutrition/calculate`, {
          gender,
          weight,
          height,
          age,
          activityLevel,
          goal,
        });

        const { calories, protein, carbs, fats } = response.data;
        setCalories(calories);
        setProtein(protein);
        setCarbs(carbs);
        setFats(fats);
      } catch (error) {
        console.error('Error fetching nutrition data:', error);
        Alert.alert('Error', 'Failed to fetch nutrition recommendations.');
      }
    };

    fetchNutrition();
  }, []);

  const handleNext = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userID;

      await axios.post(`${API_URL}/api/nutrition/save`, {
        userId,
        calories,
        protein,
        carbs,
        fats,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigation.navigate('WorkoutSelection', { userId });
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      Alert.alert('Error', 'Failed to save nutrition data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#141414' }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Your Recommended Nutrition</Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🔥 Calories</Text>
              <TextInput
                style={styles.cardInput}
                value={calories.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setCalories(value)}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🥩 Protein (g)</Text>
              <TextInput
                style={styles.cardInput}
                value={protein.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setProtein(value)}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🍞 Carbs (g)</Text>
              <TextInput
                style={styles.cardInput}
                value={carbs.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setCarbs(value)}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🥑 Fats (g)</Text>
              <TextInput
                style={styles.cardInput}
                value={fats.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setFats(value)}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#141414',
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderColor: '#333',
    borderWidth: 1,
  },
  cardTitle: {
    color: '#008080',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardInput: {
    backgroundColor: '#141414',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
  },
  button: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NutritionRecommendationScreen;
