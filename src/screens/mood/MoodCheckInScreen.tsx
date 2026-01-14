import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Button, Card, Checkbox } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { MOOD_QUESTIONNAIRE, classifyMoodState } from '../../constants/moodData';
import { syncMoodEntry, getMoodEntries, getUserProfile } from '../../services/cloudStorage';
import type { MoodEntry } from '../../types';

interface MoodCheckInScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export const MoodCheckInScreen: React.FC<MoodCheckInScreenProps> = ({ onComplete, onBack }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionA, setSectionA] = useState<boolean[]>(new Array(9).fill(false));
  const [sectionB, setSectionB] = useState<boolean[]>(new Array(8).fill(false));
  const [sectionC, setSectionC] = useState<boolean[]>(new Array(4).fill(false));
  const [sectionD, setSectionD] = useState(false);
  const [showSafetyAlert, setShowSafetyAlert] = useState(false);
  
  const sections = [
    { title: 'Mania/Hypomania', key: 'A' },
    { title: 'Depression', key: 'B' },
    { title: 'Mixed Features', key: 'C' },
    { title: 'Safety', key: 'D' },
  ];
  
  const progress = ((currentSection + 1) / sections.length) * 100;
  
  useEffect(() => {
    loadTodaysEntry();
  }, []);
  
  const loadTodaysEntry = async () => {
    const entries = await getMoodEntries();
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(e => e.date === today);
    
    if (todayEntry) {
      setSectionA(todayEntry.sectionA);
      setSectionB(todayEntry.sectionB);
      setSectionC(todayEntry.sectionC);
      setSectionD(todayEntry.sectionD);
    }
  };
  
  const handleToggleA = (index: number) => {
    const newSection = [...sectionA];
    newSection[index] = !newSection[index];
    setSectionA(newSection);
  };
  
  const handleToggleB = (index: number) => {
    const newSection = [...sectionB];
    newSection[index] = !newSection[index];
    setSectionB(newSection);
  };
  
  const handleToggleC = (index: number) => {
    const newSection = [...sectionC];
    newSection[index] = !newSection[index];
    setSectionC(newSection);
  };
  
  const handleToggleD = (checked: boolean) => {
    setSectionD(checked);
    if (checked) {
      setShowSafetyAlert(true);
    }
  };
  
  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      onBack();
    }
  };
  
  const handleSubmit = async () => {
    try {
      const scores = {
        mania: sectionA.filter(Boolean).length,
        depression: sectionB.filter(Boolean).length,
        mixed: sectionC.filter(Boolean).length,
      };
      
      const moodState = classifyMoodState({
        ...scores,
        safety: sectionD,
      });
      
      const entry: MoodEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        timestamp: Date.now(),
        sectionA,
        sectionB,
        sectionC,
        sectionD,
        scores,
        moodState,
      };
      
      await syncMoodEntry(entry);
      
      Alert.alert(
        'Success',
        'Your mood check-in has been saved!',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      console.error('Error saving mood entry:', error);
      Alert.alert('Error', 'Failed to save your check-in. Please try again.');
    }
  };
  
  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{MOOD_QUESTIONNAIRE.sectionA.title}</Text>
            <Text style={styles.sectionDescription}>{MOOD_QUESTIONNAIRE.sectionA.description}</Text>
            
            {MOOD_QUESTIONNAIRE.sectionA.items.map((item, index) => (
              <View key={index} style={styles.checkboxItem}>
                <Checkbox
                  checked={sectionA[index]}
                  onCheckedChange={() => handleToggleA(index)}
                />
                <Text style={styles.checkboxLabel}>{item}</Text>
              </View>
            ))}
          </View>
        );
        
      case 1:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{MOOD_QUESTIONNAIRE.sectionB.title}</Text>
            <Text style={styles.sectionDescription}>{MOOD_QUESTIONNAIRE.sectionB.description}</Text>
            
            {MOOD_QUESTIONNAIRE.sectionB.items.map((item, index) => (
              <View key={index} style={styles.checkboxItem}>
                <Checkbox
                  checked={sectionB[index]}
                  onCheckedChange={() => handleToggleB(index)}
                />
                <Text style={styles.checkboxLabel}>{item}</Text>
              </View>
            ))}
          </View>
        );
        
      case 2:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{MOOD_QUESTIONNAIRE.sectionC.title}</Text>
            <Text style={styles.sectionDescription}>{MOOD_QUESTIONNAIRE.sectionC.description}</Text>
            
            {MOOD_QUESTIONNAIRE.sectionC.items.map((item, index) => (
              <View key={index} style={styles.checkboxItem}>
                <Checkbox
                  checked={sectionC[index]}
                  onCheckedChange={() => handleToggleC(index)}
                />
                <Text style={styles.checkboxLabel}>{item}</Text>
              </View>
            ))}
          </View>
        );
        
      case 3:
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{MOOD_QUESTIONNAIRE.sectionD.title}</Text>
            <Text style={styles.sectionDescription}>
              {MOOD_QUESTIONNAIRE.sectionD.description} (Optional - only check if this applies to you)
            </Text>
            
            <View style={[styles.checkboxItem, styles.safetyItem]}>
              <Checkbox
                checked={sectionD}
                onCheckedChange={handleToggleD}
              />
              <Text style={[styles.checkboxLabel, styles.safetyLabel]}>
                {MOOD_QUESTIONNAIRE.sectionD.items[0]}
              </Text>
            </View>
            
            {showSafetyAlert && (
              <View style={styles.crisisBox}>
                <Text style={styles.crisisTitle}>⚠️ Immediate Help Available:</Text>
                <Text style={styles.crisisText}>• Call 988 (Suicide & Crisis Lifeline)</Text>
                <Text style={styles.crisisText}>• Text HOME to 741741 (Crisis Text Line)</Text>
                <Text style={styles.crisisText}>• Call 911 if in immediate danger</Text>
              </View>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Step {currentSection + 1} of {sections.length}
            </Text>
          </View>
          
          <Text style={styles.title}>Daily Mood Check-In</Text>
          <Text style={styles.subtitle}>
            {sections[currentSection].title}
          </Text>
          
          {renderSection()}
          
          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              style={styles.button}
            />
            <Button
              title={currentSection === sections.length - 1 ? 'Submit' : 'Next'}
              onPress={handleNext}
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
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressText: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  sectionContent: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: typography.fontSize.small,
    color: colors.textDark,
    marginLeft: spacing.sm + 4,
    lineHeight: 20,
  },
  safetyItem: {
    borderColor: '#FECACA',
    backgroundColor: '#FEE2E2',
  },
  safetyLabel: {
    fontWeight: typography.fontWeight.semibold,
    color: '#991B1B',
  },
  crisisBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  crisisTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: '#991B1B',
    marginBottom: spacing.sm,
  },
  crisisText: {
    fontSize: typography.fontSize.small,
    color: '#991B1B',
    marginBottom: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm + 4,
  },
  button: {
    flex: 1,
  },
});
