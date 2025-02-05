import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CommonActions } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken'); // ✅ Remove token

    // ✅ Reset navigation to AuthStack (not just Login)
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }], // ✅ Ensure 'AuthStack' exists in AppNavigator
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Burnix</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
});

export default HomeScreen;
