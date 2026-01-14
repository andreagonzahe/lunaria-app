import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Button, Card } from '../../components';
import { colors, typography, spacing } from '../../constants/theme';
import { getMoodEntries } from '../../services/cloudStorage';
import type { MoodEntry } from '../../types';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  
  useEffect(() => {
    loadTodaysEntry();
  }, []);
  
  const loadTodaysEntry = async () => {
    const entries = await getMoodEntries();
    const today = new Date().toISOString().split('T')[0];
    const entry = entries.find(e => e.date === today);
    setTodayEntry(entry || null);
  };
  
  const getMoodStateLabel = (state: string) => {
    const labels: { [key: string]: string } = {
      'elevated': '⚡ Elevated/Hypomanic',
      'depressed': '😔 Depressed',
      'mixed': '🌀 Mixed Features',
      'baseline': '✨ Baseline',
      'safety-alert': '⚠️ Safety Alert',
    };
    return labels[state] || 'Unknown';
  };
  
  const getMoodStateColor = (state: string) => {
    const colorMap: { [key: string]: string } = {
      'elevated': colors.elevated,
      'depressed': colors.depressed,
      'mixed': colors.mixed,
      'baseline': colors.baseline,
      'safety-alert': colors.warning,
    };
    return colorMap[state] || colors.textLight;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/lunaria-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.greeting}>Good day!</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}</Text>
        
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Daily Mood Check-In</Text>
          {!todayEntry ? (
            <>
              <Text style={styles.cardDescription}>
                Take a few minutes to check in with yourself
              </Text>
              <Button
                title="Complete Today's Check-In"
                onPress={() => onNavigate('MoodCheckIn')}
                size="lg"
                style={styles.button}
              />
            </>
          ) : (
            <>
              <Text style={styles.cardDescription}>
                ✅ You've completed today's check-in!
              </Text>
              <View style={styles.moodResult}>
                <Text style={styles.moodLabel}>Today's Mood State:</Text>
                <Text style={[styles.moodValue, { color: getMoodStateColor(todayEntry.moodState) }]}>
                  {getMoodStateLabel(todayEntry.moodState)}
                </Text>
              </View>
              <Button
                title="View or Edit Check-In"
                onPress={() => onNavigate('MoodCheckIn')}
                variant="outline"
                style={styles.button}
              />
            </>
          )}
        </Card>
        
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Current Mood State</Text>
            {todayEntry ? (
              <Text style={[styles.statValue, { color: getMoodStateColor(todayEntry.moodState) }]}>
                {getMoodStateLabel(todayEntry.moodState)}
              </Text>
            ) : (
              <Text style={styles.statValue}>Not tracked yet</Text>
            )}
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logo: {
    width: 160,
    height: 64,
  },
  greeting: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
  },
  date: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  button: {
    width: '100%',
  },
  moodResult: {
    marginBottom: spacing.md,
  },
  moodLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  moodValue: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
  },
  statsContainer: {
    gap: spacing.md,
  },
  statCard: {
    padding: spacing.md,
  },
  statLabel: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
    color: colors.textLight,
  },
});
