import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // For Android, set up notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('medication-reminders', {
        name: 'Medication Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

// Schedule a medication reminder
export async function scheduleMedicationReminder(
  medication: Medication
): Promise<string[]> {
  if (!medication.remindersEnabled) {
    return [];
  }

  const notificationIds: string[] = [];

  try {
    // Request permissions if not granted
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permissions not granted');
      return [];
    }

    // Schedule a notification for each time
    for (const time of medication.times) {
      const [hours, minutes] = time.split(':').map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '💊 Time for your medication',
          body: medication.isPRN 
            ? `${medication.name} (${medication.dose}) - Take as needed`
            : `${medication.name} (${medication.dose})`,
          data: {
            medicationId: medication.id,
            medicationName: medication.name,
          },
          sound: 'default',
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true, // Repeat daily
        },
      });

      notificationIds.push(notificationId);
    }

    console.log(`Scheduled ${notificationIds.length} reminders for ${medication.name}`);
    return notificationIds;
  } catch (error) {
    console.error('Error scheduling medication reminder:', error);
    return [];
  }
}

// Cancel all reminders for a medication
export async function cancelMedicationReminders(
  notificationIds: string[]
): Promise<void> {
  try {
    for (const id of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
    console.log(`Cancelled ${notificationIds.length} reminders`);
  } catch (error) {
    console.error('Error cancelling medication reminders:', error);
  }
}

// Cancel all notifications
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Cancelled all notifications');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

// Get all scheduled notifications (for debugging)
export async function getAllScheduledNotifications() {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

// Update medication reminders (cancel old, schedule new)
export async function updateMedicationReminders(
  oldNotificationIds: string[],
  medication: Medication
): Promise<string[]> {
  // Cancel old reminders
  await cancelMedicationReminders(oldNotificationIds);

  // Schedule new reminders if enabled
  if (medication.remindersEnabled) {
    return await scheduleMedicationReminder(medication);
  }

  return [];
}
