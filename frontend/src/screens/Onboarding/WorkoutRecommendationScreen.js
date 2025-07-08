import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
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

                if (response.data && response.data.plan) {
                    setWorkoutPlan(response.data);
                } else {
                    setWorkoutPlan(null);
                }
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
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#008080" />
                    <Text style={styles.loadingText}>Loading workout recommendations...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!workoutPlan || !workoutPlan.plan) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.errorText}>No workout plan available.</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Your Workout Plan</Text>
                <Text style={styles.splitText}>Split: {workoutPlan.split}</Text>

                {Object.entries(workoutPlan.plan).map(([day, exercises]) => (
                    <View key={day} style={styles.card}>
                        <Text style={styles.dayTitle}>{day}</Text>
                        {exercises.map((exercise, index) => (
                            <Text key={index} style={styles.exerciseText}>• {exercise}</Text>
                        ))}
                    </View>
                ))}

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPlan}>
                    <Text style={styles.confirmButtonText}>Confirm Plan</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#141414',
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#141414',
        padding: 20,
        alignItems: 'center',
        marginTop: 25,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    splitText: {
        fontSize: 18,
        color: '#ccc',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00b3b3',
        marginBottom: 10,
    },
    exerciseText: {
        fontSize: 15,
        color: '#f2f2f2',
        marginBottom: 4,
    },
    confirmButton: {
        backgroundColor: '#008080',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 25,
        width: '90%',
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#141414',
    },
    loadingText: {
        color: '#ccc',
        marginTop: 15,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
    },
});

export default WorkoutRecommendationScreen;
