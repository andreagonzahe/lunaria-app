import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { Button, Card, RadioGroup, Switch, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface CycleSetupScreenProps {
  onNext: (data: {
    cyclePreference: 'auto' | 'manual';
    hasIrregularCycles: boolean;
    lastPeriodDate: string | null;
  }) => void;
  onBack: () => void;
}

export const CycleSetupScreen: React.FC<CycleSetupScreenProps> = ({ onNext, onBack }) => {
  const [cyclePreference, setCyclePreference] = useState<'auto' | 'manual'>('auto');
  const [hasIrregularCycles, setHasIrregularCycles] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | null>(null);
  const [dontKnowLastPeriod, setDontKnowLastPeriod] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleIrregularCyclesChange = (checked: boolean) => {
    setHasIrregularCycles(checked);
    // If irregular cycles is selected, default to manual tracking
    if (checked) {
      setCyclePreference('manual');
    }
  };
  
  const handleContinue = () => {
    onNext({
      cyclePreference,
      hasIrregularCycles,
      lastPeriodDate: dontKnowLastPeriod ? null : (lastPeriodDate ? lastPeriodDate.toISOString().split('T')[0] : null),
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setLastPeriodDate(selectedDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const trackingOptions = [
    {
      value: 'auto',
      label: 'Automatic Tracking',
      description: "The app will estimate your cycle phase based on your last period date",
    },
    {
      value: 'manual',
      label: 'Manual Tracking',
      description: "You'll manually log your cycle phase each day",
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.title}>Cycle Tracking</Text>
          <Text style={styles.subtitle}>
            Set up how you'd like to track your menstrual cycle
          </Text>
          
          {/* Irregular Cycles Switch */}
          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Text style={styles.switchTitle}>I have irregular cycles</Text>
              <Text style={styles.switchDescription}>
                Cycle length varies significantly month to month
              </Text>
            </View>
            <Switch
              value={hasIrregularCycles}
              onValueChange={handleIrregularCyclesChange}
            />
          </View>
          
          {/* Tracking Preference */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tracking Preference</Text>
            <RadioGroup
              options={trackingOptions}
              value={cyclePreference}
              onValueChange={(value) => setCyclePreference(value as 'auto' | 'manual')}
            />
          </View>
          
          {/* Last Period Date (only for auto tracking) */}
          {cyclePreference === 'auto' && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>When did your last period start?</Text>
              
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => !dontKnowLastPeriod && setShowDatePicker(true)}
                disabled={dontKnowLastPeriod}
              >
                <Ionicons name="calendar-outline" size={20} color={dontKnowLastPeriod ? colors.disabled : colors.primary} />
                <Text style={[
                  styles.datePickerText,
                  !lastPeriodDate && styles.datePickerPlaceholder,
                  dontKnowLastPeriod && styles.datePickerDisabled
                ]}>
                  {lastPeriodDate ? formatDate(lastPeriodDate) : 'Select date'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={dontKnowLastPeriod ? colors.disabled : colors.textLight} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={lastPeriodDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)}
                />
              )}

              {Platform.OS === 'ios' && showDatePicker && (
                <View style={styles.datePickerActions}>
                  <Button
                    title="Done"
                    onPress={() => setShowDatePicker(false)}
                  />
                </View>
              )}

              <Text style={styles.helpText}>
                This helps us estimate your current cycle phase
              </Text>
              
              <View style={styles.checkboxRow}>
                <Switch
                  value={dontKnowLastPeriod}
                  onValueChange={setDontKnowLastPeriod}
                />
                <Text style={styles.checkboxLabel}>
                  I don't know my last period date
                </Text>
              </View>
            </View>
          )}
          
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Why track cycle phases?</Text> Research shows hormonal fluctuations during 
              the menstrual cycle can influence mood symptoms in people with bipolar disorder. 
              Understanding your unique patterns can be empowering.
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
              title="Continue"
              onPress={handleContinue}
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  switchLabel: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm + 4,
  },
  helpText: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkboxLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textDark,
    marginLeft: spacing.sm,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    marginBottom: spacing.sm,
  },
  datePickerText: {
    flex: 1,
    fontSize: typography.fontSize.body,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },
  datePickerPlaceholder: {
    color: colors.textLight,
  },
  datePickerDisabled: {
    color: colors.disabled,
  },
  datePickerActions: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
});
