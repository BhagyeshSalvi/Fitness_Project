import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const WorkoutRecommendationScreen = ({ route, navigation, setIsAuthenticated }) => {
    const { userId } = route.params;
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutRecommendation = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const response = await axios.get(`${API_URL}/api/workout/recommend/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWorkoutPlan(response.data);
            } catch (error) {
                console.error('Error fetching workout recommendation:', error);
                Alert.alert('Error', 'Failed to fetch workout recommendations. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkoutRecommendation();
    }, [userId]);

    const handleConfirmPlan = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            await axios.post(`${API_URL}/api/workout/save-plan`, {
                userId,
                workoutPlan,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsAuthenticated(true); // ✅ Log the user into the app
        } catch (error) {
            console.error('Error saving workout plan:', error);
            Alert.alert('Error', 'Failed to save workout plan. Please try again.');
        }
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading workout recommendations...</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Recommended Workout Plan</Text>
            {workoutPlan ? (
                <>
                    <Text style={styles.splitText}>Workout Split: {workoutPlan.split}</Text>
                    {Object.entries(workoutPlan.plan).map(([day, exercises]) => (
                        <View key={day} style={styles.dayContainer}>
                            <Text style={styles.dayTitle}>{day}</Text>
                            {exercises.map((exercise, index) => (
                                <Text key={index} style={styles.exerciseText}>• {exercise}</Text>
                            ))}
                        </View>
                    ))}
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPlan}>
                        <Text style={styles.confirmButtonText}>Confirm Plan</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.errorText}>No workout plan available.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    splitText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    dayContainer: { marginBottom: 15, alignItems: 'center' },
    dayTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    exerciseText: { fontSize: 14 },
    confirmButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, marginTop: 20, width: '80%', alignItems: 'center' },
    confirmButtonText: { color: '#fff', fontSize: 16 },
    loadingText: { fontSize: 16, textAlign: 'center', marginTop: 50 },
    errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
});

export default WorkoutRecommendationScreen;
