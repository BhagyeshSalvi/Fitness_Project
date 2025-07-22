import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@env';
import { useFocusEffect } from '@react-navigation/native';

const NotificationSettingsScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchPrefs = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken');
          const decoded = jwtDecode(token);
          const uid = decoded.userID;
          setUserId(uid);

          const res = await axios.get(`${API_URL}/api/notifications/${uid}`);
          if (isActive) setPrefs(res.data);
        } catch (err) {
          if (err.response?.status === 404) {
            if (isActive) setPrefs(null); // no prefs yet
          } else {
            console.error("❌ Failed to fetch notification prefs", err);
            if (isActive) setPrefs(null);
          }
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchPrefs();
      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#0ff" size="large" />
      </View>
    );
  }

  const noPrefsSet = !prefs || (!prefs.meal_reminder && !prefs.workout_reminder);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notification Settings</Text>

      {noPrefsSet ? (
        <>
          <Text style={styles.infoText}>
            You haven’t set up your meal or workout reminders yet.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditNotification')}>
            <Text style={styles.buttonText}>Set Up Notifications</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.reminderBox}>
            <Text style={styles.reminderLabel}>Meal Reminder</Text>
            <Text style={styles.reminderTime}>
              {prefs.meal_reminder
                ? `⏰ ${prefs.meal_reminder_time?.slice(0, 5) || 'Not set'}`
                : 'Not set'}
            </Text>
          </View>

          <View style={styles.reminderBox}>
            <Text style={styles.reminderLabel}>Workout Reminder</Text>
            <Text style={styles.reminderTime}>
              {prefs.workout_reminder
                ? `⏰ ${prefs.workout_reminder_time?.slice(0, 5) || 'Not set'}`
                : 'Not set'}
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditNotification')}>
            <Text style={styles.buttonText}>Edit Preferences</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Ponomar-Regular',
    alignSelf: 'center',
    marginBottom: 30,
  },
  infoText: {
    color: '#aaa',
    fontSize: 16,
    fontFamily: 'Ponomar-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Ponomar-Regular',
  },
  reminderBox: {
    backgroundColor: '#1f1f1f',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  reminderLabel: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
  },
  reminderTime: {
    color: '#0ff',
    fontSize: 16,
    fontFamily: 'Ponomar-Regular',
    marginTop: 4,
  },
});

export default NotificationSettingsScreen;
