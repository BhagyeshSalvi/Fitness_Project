import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  ImageBackground 
} from 'react-native';
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
    <ImageBackground source={require('../../assets/Bg.jpeg')} style={styles.background} >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#ccc" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Password" 
          placeholderTextColor="#ccc" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#00AEEF', marginBottom: 20 },
  input: { width: '100%', height: 50, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, paddingHorizontal: 15, marginBottom: 10, color: '#fff' },
  button: { backgroundColor: '#00AEEF', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  linkText: { marginTop: 15, color: '#00AEEF', fontSize: 14, fontWeight: 'bold' }
});

export default LoginScreen;
