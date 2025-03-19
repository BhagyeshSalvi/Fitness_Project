import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@env';

const PersonalDetailsScreen = ({ navigation }) => {
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [goal, setGoal] = useState('');

    const handleNext = async () => {
        // Check if all fields are filled
        if (!gender || !weight || !height || !age || !activityLevel || !goal) {
            alert('Please fill all fields.');
            return;
        }

        // Validate weight
        const weightValue = parseFloat(weight);
        if (weightValue < 30 || weightValue > 300) {
            alert('Please enter a valid weight between 30kg and 300kg.');
            return;
        }

        // Validate height (in feet for now)
        const heightValue = parseFloat(height);
        if (heightValue < 1.5 || heightValue > 8) {
            alert('Please enter a valid height between 1.5 feet and 8 feet.');
            return;
        }

        // Validate age
        const ageValue = parseInt(age, 10);
        if (ageValue < 16 || ageValue > 80) {
            alert('Please enter a valid age between 16 and 80.');
            return;
        }

        try {
            // ✅ Get JWT token and decode user_id
            const token = await SecureStore.getItemAsync('userToken');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userID;

            // ✅ Call API to save personal details
            await axios.post(`${API_URL}/api/personalDetails/save`, {
                user_id: userId,
                gender,
                weight: weightValue,
                height: heightValue,
                age: ageValue,
                activity_level: activityLevel,
                goal
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // ✅ Navigate to Nutrition Recommendation after saving
            navigation.navigate('NutritionRecommendation', {
                gender,
                weight: weightValue,
                height: heightValue,
                age: ageValue,
                activityLevel,
                goal,
            });
        } catch (error) {
            console.error('❌ Error saving personal details:', error);
            Alert.alert('Error', 'Failed to save personal details. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Tell Us About Yourself</Text>

            <Text style={styles.label}>Gender</Text>
            <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
            </Picker>

            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your weight"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />

            <Text style={styles.label}>Height (feet)</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your height"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />

            <Text style={styles.label}>Age</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your age"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
            />

            <Text style={styles.label}>Activity Level</Text>
            <Picker
                selectedValue={activityLevel}
                onValueChange={(itemValue) => setActivityLevel(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Activity Level" value="" />
                <Picker.Item label="Sedentary" value="sedentary" />
                <Picker.Item label="Lightly Active" value="lightly_active" />
                <Picker.Item label="Moderately Active" value="moderately_active" />
                <Picker.Item label="Very Active" value="very_active" />
                <Picker.Item label="Super Active" value="super_active" />
            </Picker>

            <Text style={styles.label}>Goal</Text>
            <Picker
                selectedValue={goal}
                onValueChange={(itemValue) => setGoal(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Select Goal" value="" />
                <Picker.Item label="Maintain" value="maintain" />
                <Picker.Item label="Weight Loss" value="weight_loss" />
                <Picker.Item label="Weight Gain" value="weight_gain" />
            </Picker>

            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20 },
    picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 },
    button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16 },
});

export default PersonalDetailsScreen;
