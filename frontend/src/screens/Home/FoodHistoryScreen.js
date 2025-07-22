import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '@env';
import { ScrollView } from 'react-native';

const FoodHistoryScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [groupedLogs, setGroupedLogs] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    const fetchMarkedDates = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        const decoded = jwtDecode(token);
        const userId = decoded.userID;

        const res = await axios.get(`${API_URL}/api/food/dates/${userId}`);
        const raw = res.data.markedDates;

        const normalized = {};
        Object.entries(raw).forEach(([key, value]) => {
          const formatted = new Date(key).toISOString().split('T')[0];
          normalized[formatted] = value;
        });

        setMarkedDates(normalized);
      } catch (err) {
        console.error("❌ Error fetching marked dates:", err);
      }
    };

    fetchMarkedDates();
  }, []);

  const handleDayPress = async (day) => {
    const date = day.dateString;
    setSelectedDate(date);

    try {
      const token = await SecureStore.getItemAsync('userToken');
      const decoded = jwtDecode(token);
      const userId = decoded.userID;

      const res = await axios.get(`${API_URL}/api/food/${userId}/${date}`);

      if (res.data.message === "No food logged for this date.") {
        setGroupedLogs(null);
        setNoData(true);
      } else {
        setGroupedLogs(res.data);
        setNoData(false);
      }
    } catch (err) {
      console.error("❌ Error fetching food logs:", err);
      setGroupedLogs(null);
      setNoData(true);
    }
  };

  const renderMealSection = (mealType, entries) => {
    if (!entries || entries.length === 0) return null;

    const mealIcons = {
      breakfast: '🍳',
      lunch: '🥗',
      dinner: '🍗',
      snack: '🍎',
    };

    return (
      <View key={mealType} style={styles.mealSection}>
        <Text style={styles.mealTitle}>
          {mealIcons[mealType]} {mealType.toUpperCase()}
        </Text>

        {entries.map((entry, idx) => (
          <View key={idx} style={styles.foodCard}>
            <Text style={styles.foodName}>{entry.food_name}</Text>
            <Text style={styles.foodDetails}>
              {entry.serving_size} {entry.unit}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollContent}>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: '#008080',
            },
          }),
        }}
        onDayPress={handleDayPress}
        enableSwipeMonths={true}
        hideExtraDays={false}
        showSixWeeks={true}
        theme={{
          calendarBackground: '#000',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          arrowColor: '#fff',
          textDisabledColor: '#555',
          textMonthFontSize: 26,
          textMonthFontWeight: 'bold',
          textMonthFontFamily: 'Ponomar-Regular',
        }}
      />

      {selectedDate && (
        <View style={styles.logBox}>
          <Text style={styles.dateText}>Logs for {selectedDate}</Text>
          {noData ? (
            <Text style={styles.noData}>No food logged for this date.</Text>
          ) : (
            groupedLogs && (
              <>
                {renderMealSection('breakfast', groupedLogs.breakfast)}
                {renderMealSection('lunch', groupedLogs.lunch)}
                {renderMealSection('dinner', groupedLogs.dinner)}
                {renderMealSection('snack', groupedLogs.snack)}
              </>
            )
          )}
        </View>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 10 },
  logBox: { padding: 16 },
  dateText: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  noData: { color: '#aaa', fontStyle: 'italic' },

  mealSection: { marginBottom: 18 },
  mealTitle: {
    color: '#0ff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Ponomar-Regular',
    marginBottom: 8,
  },

  foodCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  foodName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Ponomar-Regular',
  },
  foodDetails: {
    color: '#aaa',
    fontSize: 18,
    marginTop: 4,
    fontFamily: 'Ponomar-Regular',
  },
  scrollContent: {
  paddingBottom: 40,
  paddingTop: 5,
}

});

export default FoodHistoryScreen;
