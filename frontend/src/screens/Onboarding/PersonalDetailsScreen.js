import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@env';

const PersonalDetailsScreen = ({ navigation }) => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');

  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
  ]);

  const [activityOpen, setActivityOpen] = useState(false);
  const [activityLevel, setActivityLevel] = useState(null);
  const [activityItems, setActivityItems] = useState([
    { label: 'Sedentary', value: 'sedentary' },
    { label: 'Lightly Active', value: 'lightly_active' },
    { label: 'Moderately Active', value: 'moderately_active' },
    { label: 'Very Active', value: 'very_active' },
    { label: 'Super Active', value: 'super_active' }
  ]);

  const [goalOpen, setGoalOpen] = useState(false);
  const [goal, setGoal] = useState(null);
  const [goalItems, setGoalItems] = useState([
    { label: 'Maintain', value: 'maintain' },
    { label: 'Weight Loss', value: 'weight_loss' },
    { label: 'Weight Gain', value: 'weight_gain' }
  ]);

  const handleNext = async () => {
    if (!gender || !weight || !height || !age || !activityLevel || !goal) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const weightValue = parseFloat(weight);
    const heightValue = parseFloat(height);
    const ageValue = parseInt(age, 10);

    if (weightValue < 30 || weightValue > 300) {
      alert('Weight must be between 30kg and 300kg.');
      return;
    }

    if (heightValue < 1.5 || heightValue > 8) {
      alert('Height must be between 1.5ft and 8ft.');
      return;
    }

    if (ageValue < 16 || ageValue > 80) {
      alert('Age must be between 16 and 80.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userID;

      await axios.post(`${API_URL}/api/personalDetails/save`, {
        user_id: userId,
        gender,
        weight: weightValue,
        height: heightValue,
        age: ageValue,
        activity_level: activityLevel,
        goal
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigation.navigate('NutritionRecommendation', {
        gender, weight: weightValue, height: heightValue,
        age: ageValue, activityLevel, goal
      });
    } catch (error) {
      console.error('Error saving personal details:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tell Us About Yourself</Text>

      <View style={{ zIndex: 3000 }}>
        <Text style={styles.label}>Gender</Text>
        <DropDownPicker
          open={genderOpen}
          value={gender}
          items={genderItems}
          setOpen={setGenderOpen}
          setValue={setGender}
          setItems={setGenderItems}
          placeholder="Select Gender"
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
          textStyle={styles.dropdownText}
          listItemLabelStyle={styles.dropdownItemText}
          selectedItemLabelStyle={styles.dropdownSelectedText}
          placeholderStyle={styles.placeholderText}
          onOpen={() => {
            setActivityOpen(false);
            setGoalOpen(false);
          }}
        />
      </View>

      <Text style={styles.label}>Weight (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your weight"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Height (feet)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your height"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <View style={{ zIndex: 2000 }}>
        <Text style={styles.label}>Activity Level</Text>
        <DropDownPicker
          open={activityOpen}
          value={activityLevel}
          items={activityItems}
          setOpen={setActivityOpen}
          setValue={setActivityLevel}
          setItems={setActivityItems}
          placeholder="Select Activity Level"
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
          textStyle={styles.dropdownText}
          listItemLabelStyle={styles.dropdownItemText}
          selectedItemLabelStyle={styles.dropdownSelectedText}
          placeholderStyle={styles.placeholderText}
          onOpen={() => {
            setGenderOpen(false);
            setGoalOpen(false);
          }}
        />
      </View>

      <View style={{ zIndex: 1000 }}>
        <Text style={styles.label}>Goal</Text>
        <DropDownPicker
          open={goalOpen}
          value={goal}
          items={goalItems}
          setOpen={setGoalOpen}
          setValue={setGoal}
          setItems={setGoalItems}
          placeholder="Select Goal"
          listMode="SCROLLVIEW"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
          textStyle={styles.dropdownText}
          listItemLabelStyle={styles.dropdownItemText}
          selectedItemLabelStyle={styles.dropdownSelectedText}
          placeholderStyle={styles.placeholderText}
          onOpen={() => {
            setGenderOpen(false);
            setActivityOpen(false);
          }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#141414', paddingTop: 60 },
  title: { fontSize: 26, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 16, color: '#FFFFFF', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 15,
  },
  dropDownContainer: {
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownSelectedText: {
    color: '#008080',
    fontWeight: 'bold',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PersonalDetailsScreen;