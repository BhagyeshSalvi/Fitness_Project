import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const WorkoutSelectionScreen = ({ navigation }) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const toggleDaySelection = (day) => {
        setSelectedDays((prevSelected) =>
            prevSelected.includes(day)
                ? prevSelected.filter((d) => d !== day)
                : [...prevSelected, day]
        );
    };

    const handleNext = async () => {
        if (selectedDays.length === 0) {
            Alert.alert('Error', 'Please select at least one workout day.');
            return;
        }
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const userId = JSON.parse(atob(token.split('.')[1])).userID; // Decoding JWT token

            await axios.post(`${API_URL}/api/workout/save`, {
                userId,
                daysSelected: selectedDays.length,
                workoutDays: selectedDays,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigation.navigate('WorkoutRecommendation', { userId });
        } catch (error) {
            console.error('Error saving workout days:', error);
            Alert.alert('Error', 'Failed to save workout days. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Workout Days</Text>
            {days.map((day) => (
                <TouchableOpacity
                    key={day}
                    style={[styles.dayButton, selectedDays.includes(day) && styles.selectedDay]}
                    onPress={() => toggleDaySelection(day)}
                >
                    <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.nextButton, selectedDays.length === 0 && styles.disabledButton]} onPress={handleNext} disabled={selectedDays.length === 0}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    dayButton: { width: '80%', padding: 15, marginVertical: 5, borderWidth: 1, borderRadius: 8, alignItems: 'center' },
    selectedDay: { backgroundColor: '#007BFF', borderColor: '#0056b3' },
    dayText: { fontSize: 16 },
    nextButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, marginTop: 20, alignItems: 'center', width: '80%' },
    disabledButton: { backgroundColor: '#ccc' },
    nextButtonText: { color: '#fff', fontSize: 16 },
});

export default WorkoutSelectionScreen;
