import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import DropDownPicker from 'react-native-dropdown-picker';

const LogActivityScreen = ({ navigation }) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('');

  const [openActivity, setOpenActivity] = useState(false);
  const [activityItems, setActivityItems] = useState([
    { label: 'Running', value: 'Running' },
    { label: 'Cycling', value: 'Cycling' },
    { label: 'Treadmill', value: 'Treadmill' },
    { label: 'Stairmaster', value: 'Stairmaster' },
    { label: 'Jump Rope', value: 'Jump Rope' },
    { label: 'Weight Training', value: 'Weight Training' },
    { label: 'Swimming', value: 'Swimming' },
    { label: 'HIIT', value: 'HIIT' },
  ]);

  const [openIntensity, setOpenIntensity] = useState(false);
  const [intensityItems, setIntensityItems] = useState([
    { label: 'Light', value: 'light' },
    { label: 'Moderate', value: 'moderate' },
    { label: 'Intense', value: 'intense' }
  ]);

  const handleLogActivity = async () => {
    if (!selectedActivity || !duration || !intensity) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const decodedToken = jwtDecode(token);

      await axios.post(`${API_URL}/api/activity/log`, {
        user_id: decodedToken.userID,
        activity_name: selectedActivity,
        duration_minutes: duration,
        intensity: intensity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert('Success', 'Activity logged successfully!');
      navigation.goBack(); // ✅ Navigate back to WorkoutScreen
    } catch (error) {
      console.error('❌ Error logging activity:', error);
      Alert.alert('Error', 'Failed to log activity.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log New Activity</Text>

      <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          open={openActivity}
          value={selectedActivity}
          items={activityItems}
          setOpen={setOpenActivity}
          setValue={setSelectedActivity}
          setItems={setActivityItems}
          placeholder="Select Activity"
          style={styles.dropdown}
          dropDownContainerStyle={{ borderColor: '#ccc' }}
          listMode="SCROLLVIEW"
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={openIntensity}
          value={intensity}
          items={intensityItems}
          setOpen={setOpenIntensity}
          setValue={setIntensity}
          setItems={setIntensityItems}
          placeholder="Select Intensity"
          style={styles.dropdown}
          dropDownContainerStyle={{ borderColor: '#ccc' }}
          listMode="SCROLLVIEW"
        />
      </View>

      <TouchableOpacity style={styles.logButton} onPress={handleLogActivity}>
        <Text style={styles.logButtonText}>Log Activity</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  dropdown: { borderColor: '#ccc', marginBottom: 15, zIndex: 5000 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  logButton: { backgroundColor: '#008080', padding: 15, borderRadius: 8, alignItems: 'center' },
  logButtonText: { color: '#fff', fontSize: 16 },
});

export default LogActivityScreen;
