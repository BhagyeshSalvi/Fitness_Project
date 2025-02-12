import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PersonalDetailsScreen = ({ navigation }) => {
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [goal, setGoal] = useState('');

    const handleNext = () => {
        if (!gender || !weight || !height || !age || !activityLevel || !goal) {
            alert('Please fill all fields');
            return;
        }

        navigation.navigate('NutritionRecommendation', {
            gender,
            weight: parseFloat(weight),
            height: parseFloat(height),
            age: parseInt(age, 10),
            activityLevel,
            goal,
        });
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
