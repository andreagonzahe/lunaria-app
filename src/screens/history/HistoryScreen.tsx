import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { Card, Button, Badge } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { getMoodEntries } from '../../services/cloudStorage';
import type { MoodEntry } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export const HistoryScreen: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  useEffect(() => {
    loadEntries();
  }, []);
  
  const loadEntries = async () => {
    const allEntries = await getMoodEntries();
    setEntries(allEntries);
  };
  
  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startPadding = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add padding days
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };
  
  const getEntryForDate = (date: Date | null): MoodEntry | null => {
    if (!date) return null;
    const dateStr = date.toISOString().split('T')[0];
    return entries.find(e => e.date === dateStr) || null;
  };
  
  const getMoodColor = (entry: MoodEntry | null) => {
    if (!entry) return colors.surface;
    
    const colorMap: { [key: string]: string } = {
      'elevated': colors.elevated,
      'depressed': colors.depressed,
      'mixed': colors.mixed,
      'baseline': colors.baseline,
      'safety-alert': colors.warning,
    };
    
    return colorMap[entry.moodState] || colors.surface;
  };
  
  const getMoodLabel = (state: string) => {
    const labels: { [key: string]: string } = {
      'elevated': 'Elevated',
      'depressed': 'Depressed',
      'mixed': 'Mixed',
      'baseline': 'Baseline',
      'safety-alert': 'Safety Alert',
    };
    return labels[state] || 'Unknown';
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const now = new Date();
    if (nextMonth <= now) {
      setCurrentMonth(nextMonth);
    }
  };
  
  const handleToday = () => {
    setCurrentMonth(new Date());
  };
  
  const handleDayClick = (date: Date | null) => {
    const entry = getEntryForDate(date);
    if (entry) {
      setSelectedEntry(entry);
      setShowDetail(true);
    }
  };
  
  const monthDays = getMonthDays();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mood History</Text>
          <Text style={styles.subtitle}>View your past mood entries and patterns</Text>
        </View>
        
        <Card style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <View style={styles.monthTitle}>
              <Ionicons name="calendar" size={20} color={colors.textDark} />
              <Text style={styles.monthText}>{monthName}</Text>
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
                <Ionicons name="chevron-back" size={20} color={colors.textDark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleToday} style={styles.todayButton}>
                <Text style={styles.todayText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
                <Ionicons name="chevron-forward" size={20} color={colors.textDark} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Day Labels */}
          <View style={styles.dayLabels}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.dayLabel}>{day}</Text>
            ))}
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {monthDays.map((date, index) => {
              const entry = getEntryForDate(date);
              const dayNumber = date ? date.getDate() : '';
              const isToday = date && date.toDateString() === new Date().toDateString();
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !date && styles.emptyday,
                    isToday && styles.today,
                  ]}
                  onPress={() => handleDayClick(date)}
                  disabled={!entry}
                >
                  {date && (
                    <>
                      <View style={[
                        styles.dayBackground,
                        { backgroundColor: getMoodColor(entry) },
                      ]}>
                        <Text style={[
                          styles.dayNumber,
                          entry && styles.dayNumberWithEntry,
                        ]}>
                          {dayNumber}
                        </Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          
          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Legend:</Text>
            <View style={styles.legendItems}>
              <LegendItem color={colors.elevated} label="Elevated" />
              <LegendItem color={colors.depressed} label="Depressed" />
              <LegendItem color={colors.mixed} label="Mixed" />
              <LegendItem color={colors.baseline} label="Baseline" />
            </View>
          </View>
        </Card>
        
        {/* Entry Detail Modal */}
        <Modal
          visible={showDetail}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDetail(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1}
            onPress={() => setShowDetail(false)}
          >
            <View style={styles.modalContent}>
              {selectedEntry && (
                <Card style={styles.detailCard}>
                  <Text style={styles.detailDate}>
                    {new Date(selectedEntry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  
                  <View style={styles.detailMood}>
                    <Text style={styles.detailLabel}>Mood State:</Text>
                    <Text style={[
                      styles.detailValue,
                      { color: getMoodColor(selectedEntry) }
                    ]}>
                      {getMoodLabel(selectedEntry.moodState)}
                    </Text>
                  </View>
                  
                  <View style={styles.scoresGrid}>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreBoxLabel}>Mania</Text>
                      <Text style={styles.scoreBoxValue}>{selectedEntry.scores.mania}/9</Text>
                    </View>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreBoxLabel}>Depression</Text>
                      <Text style={styles.scoreBoxValue}>{selectedEntry.scores.depression}/8</Text>
                    </View>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreBoxLabel}>Mixed</Text>
                      <Text style={styles.scoreBoxValue}>{selectedEntry.scores.mixed}/4</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowDetail(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </Card>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
  },
  calendarCard: {
    padding: spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  monthTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  monthText: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  navButton: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  todayButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  todayText: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
    color: colors.textDark,
  },
  dayLabels: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textLight,
    paddingVertical: spacing.sm,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 2,
  },
  emptyday: {
    backgroundColor: 'transparent',
  },
  dayBackground: {
    flex: 1,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  today: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  dayNumber: {
    fontSize: typography.fontSize.small,
    color: colors.textDark,
  },
  dayNumberWithEntry: {
    color: colors.background,
    fontWeight: typography.fontWeight.semibold,
  },
  legend: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendTitle: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  detailCard: {
    padding: spacing.lg,
  },
  detailDate: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  detailMood: {
    marginBottom: spacing.md,
  },
  detailLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
  },
  scoresGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  scoreBox: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  scoreBoxLabel: {
    fontSize: typography.fontSize.tiny,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  scoreBoxValue: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
  },
  closeButton: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background,
  },
});
