import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Mismatch', 'New passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const token = await SecureStore.getItemAsync('userToken');
      const { userID } = jwtDecode(token);

      const res = await axios.put(`${API_URL}/api/auth/change-password`, {
        userID,
        currentPassword,
        newPassword,
      });

      Alert.alert('Success', res.data.message);

      // ✅ Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      // ✅ Navigate back to SettingsMain
      navigation.goBack();
    } catch (error) {
      const msg =
        error.response?.data?.error || 'An error occurred while changing password.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔐 Change Password</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          placeholder="Enter current password"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Enter new password"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
          placeholder="Confirm new password"
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', padding: 20, paddingTop: 60 },
  header: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Ponomar-Regular',
    marginBottom: 24,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 14,
    padding: 20,
  },
  label: {
    color: '#888',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
  },
  button: {
    backgroundColor: '#008080',
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Ponomar-Regular',
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
