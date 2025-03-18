import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '@env';

const LoginScreen = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log('Login successful:', response.data);
      await SecureStore.setItemAsync('userToken', response.data.token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message);
      if (error.response?.data?.error === 'Email does not exist') {
        Alert.alert('Login Failed', 'This email is not registered.', [{ text: 'OK' }]);
      } else if (error.response?.data?.error === 'Invalid password') {
        Alert.alert('Login Failed', 'Incorrect password. Please try again.', [{ text: 'OK' }]);
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred. Please try again.', [{ text: 'OK' }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

 
  
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../../assets/bg.png')} 
        style={styles.logo} 
        resizeMode="cover"
      />
  
      <Text style={styles.title}>Login</Text>
  
      <Animatable.View animation="fadeInUp" duration={1000} style={styles.formContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#CCCCCC" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
  
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#CCCCCC" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
  
        {/* Gradient Button */}
        <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
          <LinearGradient colors={['#008080', '#00A99D']} style={styles.gradientButton}>
            {isLoading 
              ? <ActivityIndicator color="#fff" /> 
              : <Text style={styles.buttonText}>Login</Text>}
          </LinearGradient>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
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
    padding: 20 
  },
  logo: {
    width: 240,
    height: 150,
    marginBottom: 30,
    marginTop: -180,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#FFFFFF', 
    marginBottom: 20,
    fontFamily: 'Ponomar-Regular',
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
  }
});


export default LoginScreen;
