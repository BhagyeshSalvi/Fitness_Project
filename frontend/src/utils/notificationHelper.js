import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Permission helper
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Clear old reminders
export async function clearAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// 📅 Fix: Schedule reminder for the *next future occurrence* of the specified time
export async function scheduleReminder(hour, minute, title, body) {
  if (!Device.isDevice) return;

  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour);
  triggerDate.setMinutes(minute);
  triggerDate.setSeconds(0);

  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { type: 'date', date: triggerDate }, // ✅ Use correct format
  });
}
