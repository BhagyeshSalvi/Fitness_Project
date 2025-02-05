import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ Loading state

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true); // ✅ Show loading indicator

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log('Login successful:', response.data);

      // ✅ Save token securely
      await SecureStore.setItemAsync('userToken', response.data.token);

      // ✅ Update authentication state
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Login failed:', error.response?.data);

      // ✅ Show appropriate alert based on error message
      if (error.response?.data?.error === 'Email does not exist') {
        Alert.alert('Login Failed', 'This email is not registered.', [{ text: 'OK' }]);
      } else if (error.response?.data?.error === 'Invalid password') {
        Alert.alert('Login Failed', 'Incorrect password. Please try again.', [{ text: 'OK' }]);
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.', [{ text: 'OK' }]);
      }
    } finally {
      setIsLoading(false); // ✅ Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  linkText: { marginTop: 15, color: '#007BFF', fontSize: 14 },
});

export default LoginScreen;
