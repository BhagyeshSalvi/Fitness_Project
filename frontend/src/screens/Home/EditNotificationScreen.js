import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@env';
import {
  requestNotificationPermission,
  clearAllScheduledNotifications,
  scheduleReminder
} from '../../utils/notificationHelper';

const EditNotificationScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [mealReminder, setMealReminder] = useState(false);
  const [workoutReminder, setWorkoutReminder] = useState(false);
  const [mealHour, setMealHour] = useState('08');
  const [mealMinute, setMealMinute] = useState('00');
  const [workoutHour, setWorkoutHour] = useState('18');
  const [workoutMinute, setWorkoutMinute] = useState('00');

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const decoded = jwtDecode(token);
        const uid = decoded.userID;
        setUserId(uid);

        const res = await axios.get(`${API_URL}/api/notifications/${uid}`);
        const data = res.data;

        setMealReminder(!!data.meal_reminder);
        setWorkoutReminder(!!data.workout_reminder);

        if (data.meal_reminder_time) {
          const [h, m] = data.meal_reminder_time.split(':');
          setMealHour(h);
          setMealMinute(m);
        }

        if (data.workout_reminder_time) {
          const [h, m] = data.workout_reminder_time.split(':');
          setWorkoutHour(h);
          setWorkoutMinute(m);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("ℹ️ No preferences set yet for this user.");
        } else {
          console.error("❌ Failed to load preferences", err);
        }
      }
    };

    loadPreferences();
  }, []);

  const handleSave = async () => {
    if (mealReminder && (!mealHour || !mealMinute)) {
      Alert.alert("Please set a meal reminder time.");
      return;
    }
    if (workoutReminder && (!workoutHour || !workoutMinute)) {
      Alert.alert("Please set a workout reminder time.");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/notifications`, {
        user_id: userId,
        meal_reminder: mealReminder,
        meal_reminder_time: `${mealHour}:${mealMinute}`,
        workout_reminder: workoutReminder,
        workout_reminder_time: `${workoutHour}:${workoutMinute}`,
      });

      const permissionGranted = await requestNotificationPermission();
      if (permissionGranted) {
        await clearAllScheduledNotifications();

        if (mealReminder) {
          await scheduleReminder(
            parseInt(mealHour),
            parseInt(mealMinute),
            '🍽️ Meal Reminder',
            'It’s time for your scheduled meal.'
          );
        }

        if (workoutReminder) {
          await scheduleReminder(
            parseInt(workoutHour),
            parseInt(workoutMinute),
            '💪 Workout Reminder',
            'Time to get moving with your workout!'
          );
        }
      }

      Alert.alert("Preferences updated & reminders scheduled!");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error updating preferences:", err);
      Alert.alert("Failed to update preferences.");
    }
  };

 const renderTimePicker = (label, hour, setHour, minute, setMinute) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')); // ✅ updated here

  return (
    <View style={styles.timePickerContainer}>
      <Text style={styles.pickerLabel}>{label} Time</Text>
      <View style={styles.pickerRow}>
        <Picker selectedValue={hour} onValueChange={setHour} style={styles.picker}>
          {hours.map(h => <Picker.Item key={h} label={h} value={h} />)}
        </Picker>
        <Text style={styles.colon}>:</Text>
        <Picker selectedValue={minute} onValueChange={setMinute} style={styles.picker}>
          {minutes.map(m => <Picker.Item key={m} label={m} value={m} />)}
        </Picker>
      </View>
    </View>
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Notification Preferences</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Meal Reminder</Text>
        <Switch value={mealReminder} onValueChange={setMealReminder} />
      </View>
      {mealReminder && renderTimePicker("Meal", mealHour, setMealHour, mealMinute, setMealMinute)}

      <View style={styles.section}>
        <Text style={styles.label}>Workout Reminder</Text>
        <Switch value={workoutReminder} onValueChange={setWorkoutReminder} />
      </View>
      {workoutReminder && renderTimePicker("Workout", workoutHour, setWorkoutHour, workoutMinute, setWorkoutMinute)}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', padding: 20, paddingTop: 60 },
  title: { fontSize: 22, color: '#fff', fontFamily: 'Ponomar-Regular', marginBottom: 30, alignSelf: 'center' },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: { color: '#fff', fontSize: 18, fontFamily: 'Ponomar-Regular' },
  timePickerContainer: { marginBottom: 20, backgroundColor: '#1f1f1f', borderRadius: 10, padding: 10 },
  pickerLabel: { color: '#0ff', fontSize: 16, fontFamily: 'Ponomar-Regular', marginBottom: 10 },
  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  picker: { width: '45%', color: '#fff', backgroundColor: '#2a2a2a' },
  colon: { color: '#fff', fontSize: 18, paddingHorizontal: 10 },
  saveBtn: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Ponomar-Regular',
  },
});

export default EditNotificationScreen;
