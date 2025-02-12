import React, {useEffect,useState} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

const HomeScreen = ({ setIsAuthenticated }) => {
 
  const [firstname, setFirstname] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          setFirstname(decodedToken.firstname); // Extract firstname from the token
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    console.log('Logout button pressed'); 
    await SecureStore.deleteItemAsync('userToken'); // Remove token
    console.log('Token deleted'); 
    setIsAuthenticated(false); // Update state to switch to AuthStack
    console.log('isAuthenticated set to false');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Burnix</Text>
      <Text style={styles.greeting}>Hello, {firstname}!</Text> 
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  greeting: { fontSize: 24, marginBottom: 20 },
});

export default HomeScreen;
