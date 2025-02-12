import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';
import {jwtDecode} from 'jwt-decode'; 

const NutritionRecommendationScreen = ({ route, navigation, setIsAuthenticated }) => {
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
            // Retrieve the JWT token from SecureStore
            const token = await SecureStore.getItemAsync('userToken');
            

            // Decode the token to extract the userID
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userID;

            // Save nutrition data to the backend
            await axios.post(`${API_URL}/api/nutrition/save`, {
                userId,
                calories,
                protein,
                carbs,
                fats,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the header for authentication
                },
            });
            setIsAuthenticated(true); //Navigate to homescreen
        } catch (error) {
            console.error('Error saving nutrition data:', error);
            Alert.alert('Error', 'Failed to save nutrition data. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Recommended Nutrition</Text>

            <Text style={styles.label}>Calories</Text>
            <TextInput
                style={styles.input}
                value={calories.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setCalories(value)}
            />

            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
                style={styles.input}
                value={protein.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setProtein(value)}
            />

            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
                style={styles.input}
                value={carbs.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setCarbs(value)}
            />

            <Text style={styles.label}>Fats (g)</Text>
            <TextInput
                style={styles.input}
                value={fats.toString()}
                keyboardType="numeric"
                onChangeText={(value) => setFats(value)}
            />

            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
    button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16 },
});

export default NutritionRecommendationScreen;
