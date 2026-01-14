import { supabase } from '../lib/supabase';
import { UserProfile, MoodEntry, Medication, SafetyPlan } from '../types';
import * as LocalStorage from './storage';

// ============================================
// USER PROFILE
// ============================================

export const syncUserProfile = async (profile: Omit<UserProfile, 'id'>): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Generate temp ID if no user
  const userId = user?.id || `temp-${Date.now()}`;
  const fullProfile = { ...profile, id: userId };

  // Always save locally first
  await LocalStorage.saveUserProfile(fullProfile);

  // If authenticated, also save to cloud
  if (user) {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        diagnosis: profile.diagnosis,
        diagnosis_other: profile.diagnosisOther,
        cycle_tracking_automatic: profile.cycleTracking.isAutomatic,
        cycle_tracking_irregular: profile.cycleTracking.isIrregular,
        last_period_date: profile.cycleTracking.lastPeriodDate,
        average_cycle_length: profile.cycleTracking.averageCycleLength,
      });

    if (error) {
      console.error('Error syncing profile to cloud:', error);
      // Don't throw - local save already succeeded
    }
  }
};

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return await LocalStorage.getUserProfile();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return await LocalStorage.getUserProfile();

  const profile: UserProfile = {
    id: data.id,
    diagnosis: data.diagnosis,
    diagnosisOther: data.diagnosis_other,
    onboardingComplete: true,
    cycleTracking: {
      isAutomatic: data.cycle_tracking_automatic,
      isIrregular: data.cycle_tracking_irregular,
      lastPeriodDate: data.last_period_date,
      averageCycleLength: data.average_cycle_length,
    },
    createdAt: data.created_at,
  };

  // Update local cache
  await LocalStorage.saveUserProfile(profile);
  return profile;
};

// ============================================
// MOOD ENTRIES
// ============================================

export const syncMoodEntry = async (entry: MoodEntry): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Always save locally first (offline-first)
  await LocalStorage.saveMoodEntry(entry);

  if (!user) return; // Offline mode

  const { error } = await supabase
    .from('mood_entries')
    .upsert({
      id: entry.id,
      user_id: user.id,
      entry_date: entry.date,
      timestamp: entry.timestamp,
      section_a: entry.sectionA,
      section_b: entry.sectionB,
      section_c: entry.sectionC,
      section_d: entry.sectionD,
      mania_score: entry.scores.mania,
      depression_score: entry.scores.depression,
      mixed_score: entry.scores.mixed,
      mood_state: entry.moodState,
      cycle_phase: entry.cyclePhase,
      sleep_hours: entry.sleep?.hours,
      sleep_quality: entry.sleep?.quality,
    });

  if (error) console.error('Sync error:', error);
};

export const getMoodEntries = async (
  startDate?: Date,
  endDate?: Date
): Promise<MoodEntry[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Try cloud first if logged in
  if (user) {
    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false });

    if (startDate) {
      query = query.gte('entry_date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      query = query.lte('entry_date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;

    if (!error && data) {
      // Map to local format
      const entries: MoodEntry[] = data.map(d => ({
        id: d.id,
        date: d.entry_date,
        timestamp: d.timestamp,
        sectionA: d.section_a,
        sectionB: d.section_b,
        sectionC: d.section_c,
        sectionD: d.section_d,
        scores: {
          mania: d.mania_score,
          depression: d.depression_score,
          mixed: d.mixed_score,
        },
        moodState: d.mood_state,
        cyclePhase: d.cycle_phase,
        sleep: d.sleep_hours ? {
          hours: d.sleep_hours,
          quality: d.sleep_quality,
        } : undefined,
      }));

      // Update local cache
      for (const entry of entries) {
        await LocalStorage.saveMoodEntry(entry);
      }

      return entries;
    }
  }

  // Fallback to local
  return await LocalStorage.getMoodEntries(startDate, endDate);
};

// ============================================
// MEDICATIONS
// ============================================

export const syncMedications = async (medications: Medication[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Always save locally first
  await LocalStorage.saveMedications(medications);

  if (!user) return; // Not authenticated - local save is enough

  // Delete all existing medications for this user
  await supabase
    .from('medications')
    .delete()
    .eq('user_id', user.id);

  // Insert new medications
  if (medications.length > 0) {
    const { error } = await supabase
      .from('medications')
      .insert(
        medications.map(med => ({
          id: med.id,
          user_id: user.id,
          name: med.name,
          dose: med.dose,
          times: med.times,
          reminders_enabled: med.remindersEnabled,
          is_prn: med.isPRN,
        }))
      );

    if (error) console.error('Error syncing medications:', error);
  }
};

export const getMedications = async (): Promise<Medication[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Try cloud first if logged in
  if (user) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      const medications: Medication[] = data.map(d => ({
        id: d.id,
        name: d.name,
        dose: d.dose,
        times: d.times,
        remindersEnabled: d.reminders_enabled,
        isPRN: d.is_prn,
      }));

      // Update local cache
      await LocalStorage.saveMedications(medications);
      return medications;
    }
  }

  // Fallback to local
  return await LocalStorage.getMedications();
};

// ============================================
// SAFETY PLAN
// ============================================

export const syncSafetyPlan = async (plan: SafetyPlan): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Always save locally first (using secure store)
  await LocalStorage.saveSafetyPlan(plan);

  if (!user) return; // Not authenticated - local save is enough

  const { error } = await supabase
    .from('safety_plans')
    .upsert({
      user_id: user.id,
      content: plan.content,
      format: plan.format,
      file_uri: plan.fileUri,
      emergency_contact_name: plan.emergencyContact?.name,
      emergency_contact_phone: plan.emergencyContact?.phone,
    });

  if (error) console.error('Error syncing safety plan:', error);
};

export const getSafetyPlan = async (): Promise<SafetyPlan | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Try cloud first if logged in
  if (user) {
    const { data, error } = await supabase
      .from('safety_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      const plan: SafetyPlan = {
        content: data.content || '',
        format: data.format || 'text',
        fileUri: data.file_uri,
        emergencyContact: data.emergency_contact_name ? {
          name: data.emergency_contact_name,
          phone: data.emergency_contact_phone || '',
        } : undefined,
        updatedAt: data.updated_at,
      };

      // Update local cache
      await LocalStorage.saveSafetyPlan(plan);
      return plan;
    }
  }

  // Fallback to local
  return await LocalStorage.getSafetyPlan();
};

// ============================================
// SYNC ALL DATA (for initial login)
// ============================================

export const syncAllData = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    // Pull all data from cloud
    await getUserProfile();
    await getMoodEntries();
    await getMedications();
    await getSafetyPlan();
  } catch (error) {
    console.error('Sync all data error:', error);
  }
};

// ============================================
// AUTH HELPERS
// ============================================

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};
