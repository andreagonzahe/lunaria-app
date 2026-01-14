import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { UserProfile, MoodEntry, Medication, SafetyPlan } from '../types';

const KEYS = {
  USER_PROFILE: 'user_profile',
  MOOD_ENTRIES: 'mood_entries',
  MEDICATIONS: 'medications',
  SAFETY_PLAN: 'safety_plan',
};

// User Profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

// Mood Entries
export const saveMoodEntry = async (entry: MoodEntry): Promise<void> => {
  const entries = await getMoodEntries();
  const existingIndex = entries.findIndex(e => e.date === entry.date);
  
  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }
  
  // Sort by date descending
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  await AsyncStorage.setItem(KEYS.MOOD_ENTRIES, JSON.stringify(entries));
};

export const getMoodEntries = async (
  startDate?: Date,
  endDate?: Date
): Promise<MoodEntry[]> => {
  const data = await AsyncStorage.getItem(KEYS.MOOD_ENTRIES);
  let entries: MoodEntry[] = data ? JSON.parse(data) : [];
  
  if (startDate || endDate) {
    entries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      if (startDate && entryDate < startDate) return false;
      if (endDate && entryDate > endDate) return false;
      return true;
    });
  }
  
  return entries;
};

// Medications
export const saveMedications = async (medications: Medication[]): Promise<void> => {
  await AsyncStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(medications));
};

export const getMedications = async (): Promise<Medication[]> => {
  const data = await AsyncStorage.getItem(KEYS.MEDICATIONS);
  return data ? JSON.parse(data) : [];
};

// Safety Plan (use SecureStore for sensitive data)
export const saveSafetyPlan = async (plan: SafetyPlan): Promise<void> => {
  await SecureStore.setItemAsync(KEYS.SAFETY_PLAN, JSON.stringify(plan));
};

export const getSafetyPlan = async (): Promise<SafetyPlan | null> => {
  const data = await SecureStore.getItemAsync(KEYS.SAFETY_PLAN);
  return data ? JSON.parse(data) : null;
};

// Clear all data (for account deletion)
export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    KEYS.USER_PROFILE,
    KEYS.MOOD_ENTRIES,
    KEYS.MEDICATIONS,
  ]);
  await SecureStore.deleteItemAsync(KEYS.SAFETY_PLAN);
};
