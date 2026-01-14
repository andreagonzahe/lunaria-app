import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Button, Card, RadioGroup } from '../../components';
import { colors, typography, spacing } from '../../constants/theme';
import type { UserProfile } from '../../types';

interface ConditionsScreenProps {
  onNext: (diagnosis: UserProfile['diagnosis']) => void;
  onBack: () => void;
}

export const ConditionsScreen: React.FC<ConditionsScreenProps> = ({ onNext, onBack }) => {
  const [diagnosis, setDiagnosis] = useState<UserProfile['diagnosis']>('bipolar-1');
  
  const diagnosisOptions = [
    {
      value: 'bipolar-1',
      label: 'Bipolar I Disorder',
      description: 'Characterized by manic episodes that last at least 7 days or are severe enough to require hospitalization',
    },
    {
      value: 'bipolar-2',
      label: 'Bipolar II Disorder',
      description: 'Characterized by a pattern of depressive episodes and hypomanic episodes (less severe than full mania)',
    },
    {
      value: 'cyclothymia',
      label: 'Cyclothymia',
      description: 'Characterized by periods of hypomanic and depressive symptoms that are less severe',
    },
    {
      value: 'other',
      label: 'Other',
      description: 'Other diagnosis or prefer not to specify',
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.title}>Your Diagnosis</Text>
          <Text style={styles.subtitle}>
            Select your diagnosis to help personalize your tracking experience
          </Text>
          
          <View style={styles.radioContainer}>
            <RadioGroup
              options={diagnosisOptions}
              value={diagnosis}
              onValueChange={(value) => setDiagnosis(value as UserProfile['diagnosis'])}
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={onBack}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Continue"
              onPress={() => onNext(diagnosis)}
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
  radioContainer: {
    marginBottom: spacing.lg,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
  },
  button: {
    flex: 1,
  },
});
