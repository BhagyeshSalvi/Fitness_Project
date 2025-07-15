import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PersonalDetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>📋 Personal Details Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#141414', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 22, fontFamily: 'Ponomar-Regular' },
});

export default PersonalDetailsScreen;
