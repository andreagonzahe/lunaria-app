import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, Input, Switch } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Medication } from '../../types';
import { requestNotificationPermissions, scheduleMedicationReminder } from '../../services/notifications';

interface MedicationsScreenProps {
  onNext: (medications: Medication[]) => void;
  onBack: () => void;
}

export const MedicationsScreen: React.FC<MedicationsScreenProps> = ({ onNext, onBack }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMed, setCurrentMed] = useState({
    name: '',
    dose: '',
    time: '08:00',
    isPRN: false,
    remindersEnabled: true,
  });
  const [hasRequestedPermissions, setHasRequestedPermissions] = useState(false);

  // Request notification permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const granted = await requestNotificationPermissions();
    setHasRequestedPermissions(true);
    if (!granted) {
      Alert.alert(
        'Notifications Disabled',
        'Medication reminders will not work without notification permissions. You can enable them later in your phone settings.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const addMedication = async () => {
    if (currentMed.name && currentMed.dose) {
      const newMed: Medication = {
        id: Date.now().toString(),
        name: currentMed.name,
        dose: currentMed.dose,
        times: currentMed.isPRN ? [] : [currentMed.time],
        remindersEnabled: currentMed.isPRN ? false : currentMed.remindersEnabled,
        isPRN: currentMed.isPRN,
      };

      // Schedule notifications if enabled
      if (newMed.remindersEnabled && !newMed.isPRN) {
        await scheduleMedicationReminder(newMed);
      }

      setMedications([...medications, newMed]);
      setCurrentMed({ name: '', dose: '', time: '08:00', isPRN: false, remindersEnabled: true });
    }
  };
  
  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.title}>Your Medications</Text>
          <Text style={styles.subtitle}>
            Add any medications you're currently taking (optional)
          </Text>
          
          {/* Add Medication Form */}
          <View style={styles.form}>
            <Input
              label="Medication Name"
              placeholder="e.g., Lithium"
              value={currentMed.name}
              onChangeText={(text) => setCurrentMed({ ...currentMed, name: text })}
            />
            
            <Input
              label="Dose"
              placeholder="e.g., 300mg"
              value={currentMed.dose}
              onChangeText={(text) => setCurrentMed({ ...currentMed, dose: text })}
            />
            
            {!currentMed.isPRN && (
              <>
                <Input
                  label="Time"
                  placeholder="e.g., 08:00"
                  value={currentMed.time}
                  onChangeText={(text) => setCurrentMed({ ...currentMed, time: text })}
                />
                
                <View style={styles.reminderRow}>
                  <View style={styles.reminderLabel}>
                    <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                    <Text style={styles.reminderText}>Enable reminders</Text>
                  </View>
                  <Switch
                    value={currentMed.remindersEnabled}
                    onValueChange={(checked) => setCurrentMed({ ...currentMed, remindersEnabled: checked })}
                  />
                </View>
              </>
            )}
            
            <View style={styles.prnRow}>
              <Switch
                value={currentMed.isPRN}
                onValueChange={(checked) => setCurrentMed({ ...currentMed, isPRN: checked })}
              />
              <Text style={styles.prnLabel}>PRN (as needed)</Text>
            </View>
            
            <Button
              title="Add Medication"
              onPress={addMedication}
              variant="outline"
              style={styles.addButton}
            />
          </View>
          
          {/* Medications List */}
          {medications.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Added Medications:</Text>
              {medications.map((med) => (
                <View key={med.id} style={styles.medItem}>
                  <View style={styles.medInfo}>
                    <View style={styles.medNameRow}>
                      <Text style={styles.medName}>{med.name}</Text>
                      {med.remindersEnabled && !med.isPRN && (
                        <Ionicons name="notifications" size={16} color={colors.primary} />
                      )}
                    </View>
                    <Text style={styles.medDetails}>
                      {med.dose} {med.isPRN ? '(PRN - as needed)' : `at ${med.times[0]}`}
                    </Text>
                    {med.remindersEnabled && !med.isPRN && (
                      <Text style={styles.reminderEnabled}>📱 Reminders enabled</Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => removeMedication(med.id)}>
                    <Ionicons name="trash-outline" size={20} color={colors.warning} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Why track medications?</Text> Medication adherence can significantly impact mood stability. 
              Tracking helps you and your healthcare provider understand patterns and optimize your treatment.
            </Text>
          </View>
          
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={onBack}
              variant="outline"
              style={styles.button}
            />
            <Button
              title={medications.length > 0 ? 'Continue' : 'Skip'}
              onPress={() => onNext(medications)}
              style={styles.button}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    width: '100%',
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  form: {
    marginBottom: spacing.lg,
  },
  prnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  prnLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  reminderLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderText: {
    fontSize: typography.fontSize.body,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },
  medNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  reminderEnabled: {
    fontSize: typography.fontSize.small,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  addButton: {
    marginTop: spacing.sm,
  },
  listContainer: {
    marginBottom: spacing.lg,
  },
  listTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
  },
  medDetails: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  infoBox: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: typography.fontSize.small,
    color: '#6B21A8',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: typography.fontWeight.bold,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
  },
  button: {
    flex: 1,
  },
});
