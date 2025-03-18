import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const RegisterScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (input) => {
    const passwordCriteria = /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordCriteria.test(input)) {
      setPasswordError('Password must be at least 8 characters, include a number, and a letter.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    setEmailError('');
    setPasswordError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      });

      if (response.status === 201 && response.data.token) {
        const { token } = response.data;
        await SecureStore.setItemAsync('userToken', token);
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
      <Image source={require('../../assets/bg.png')} style={styles.logo} resizeMode="cover" />
      <Text style={styles.title}>Register</Text>

      <Animatable.View animation="fadeInUp" duration={1000} style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#CCCCCC"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#CCCCCC"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#CCCCCC"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#CCCCCC"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity onPress={handleRegister}>
          <LinearGradient colors={['#008080', '#00A99D']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Register</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 240,
    height: 150,
    marginBottom: 20,
    marginTop: -100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    fontFamily:'Ponomar-Regular',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    shadowColor: '#00A99D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientButton: {
    padding: 15,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#00A99D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  linkText: {
    marginTop: 20,
    color: '#00FFD1',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    width: '100%',
    fontFamily: 'Poppins-Regular',
  },
});

export default RegisterScreen;
