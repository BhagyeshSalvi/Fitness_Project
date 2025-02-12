import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState(''); // For email validation feedback
  const [passwordError, setPasswordError] = useState(''); // For password feedback

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = (input) => {
    const passwordCriteria = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/; // At least 8 characters, one number, and one letter
    if (!passwordCriteria.test(input)) {
      setPasswordError('Password must be at least 8 characters, include a number, and a letter.');
    } else {
      setPasswordError('');
    }
  };

  const handleRegister = async () => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email,
            password,
            firstName: firstName, 
            lastName: lastName,
        });

        // Check if the backend response has a token
        if (response.status === 201 && response.data.token) {
            const { token } = response.data;

            // Save token securely
            await SecureStore.setItemAsync('userToken', token);

            // Navigate to Personal Details Screen
            navigation.navigate('PersonalDetails');
        } else {
            Alert.alert('Error', 'Unexpected response from server.');
        }
    } catch (error) {
        console.error('Registration Error:', error.response?.data || error.message);
        Alert.alert('Error', error.response?.data?.error || 'Registration failed. Please try again.');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text);
        }}
        keyboardType="email-address"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text);
        }}
      />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
  errorText: { color: 'red', fontSize: 12, marginBottom: 10 },
});

export default RegisterScreen;
