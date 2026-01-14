import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Card, Badge } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { getMoodEntries } from '../../services/cloudStorage';
import type { MoodEntry } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export const InsightsScreen: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [patterns, setPatterns] = useState<any[]>([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    const allEntries = await getMoodEntries();
    setEntries(allEntries.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
    
    // Detect simple patterns
    detectPatterns(allEntries);
  };
  
  const detectPatterns = (entries: MoodEntry[]) => {
    const detectedPatterns = [];
    
    // Pattern 1: Elevated mood during ovulation
    const ovulationEntries = entries.filter(e => e.cyclePhase === 'ovulation');
    const elevatedDuringOvulation = ovulationEntries.filter(e => e.moodState === 'elevated').length;
    if (ovulationEntries.length >= 3 && elevatedDuringOvulation / ovulationEntries.length > 0.5) {
      detectedPatterns.push({
        id: '1',
        title: 'Elevated Mood During Ovulation',
        description: `You tend to experience elevated mood symptoms during ovulation (${Math.round(elevatedDuringOvulation / ovulationEntries.length * 100)}% of the time).`,
        confidence: 'medium',
        type: 'cycle-mood',
      });
    }
    
    // Pattern 2: Depressed mood before menstruation
    const lutealEntries = entries.filter(e => e.cyclePhase === 'luteal');
    const depressedDuringLuteal = lutealEntries.filter(e => e.moodState === 'depressed').length;
    if (lutealEntries.length >= 3 && depressedDuringLuteal / lutealEntries.length > 0.5) {
      detectedPatterns.push({
        id: '2',
        title: 'Depressed Mood in Luteal Phase',
        description: `You tend to experience depressive symptoms during the luteal phase (${Math.round(depressedDuringLuteal / lutealEntries.length * 100)}% of the time).`,
        confidence: 'medium',
        type: 'cycle-mood',
      });
    }
    
    setPatterns(detectedPatterns);
  };
  
  const getMoodDistribution = () => {
    const distribution = {
      elevated: 0,
      depressed: 0,
      mixed: 0,
      baseline: 0,
      'safety-alert': 0,
    };
    
    entries.forEach(entry => {
      distribution[entry.moodState]++;
    });
    
    return distribution;
  };
  
  const getAverageScores = () => {
    if (entries.length === 0) return { mania: 0, depression: 0, mixed: 0 };
    
    const totals = entries.reduce((acc, entry) => ({
      mania: acc.mania + entry.scores.mania,
      depression: acc.depression + entry.scores.depression,
      mixed: acc.mixed + entry.scores.mixed,
    }), { mania: 0, depression: 0, mixed: 0 });
    
    return {
      mania: (totals.mania / entries.length).toFixed(1),
      depression: (totals.depression / entries.length).toFixed(1),
      mixed: (totals.mixed / entries.length).toFixed(1),
    };
  };
  
  const getChartData = () => {
    const last30Days = entries.slice(-30);
    
    if (last30Days.length === 0) {
      return {
        labels: [''],
        datasets: [
          { data: [0], color: () => colors.elevated, strokeWidth: 2 },
          { data: [0], color: () => colors.depressed, strokeWidth: 2 },
          { data: [0], color: () => colors.mixed, strokeWidth: 2 },
        ],
      };
    }
    
    const labels = last30Days.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const maniaData = last30Days.map(e => e.scores.mania);
    const depressionData = last30Days.map(e => e.scores.depression);
    const mixedData = last30Days.map(e => e.scores.mixed);
    
    return {
      labels: labels.length > 10 ? labels.filter((_, i) => i % Math.ceil(labels.length / 10) === 0) : labels,
      datasets: [
        {
          data: maniaData,
          color: () => colors.elevated,
          strokeWidth: 2,
        },
        {
          data: depressionData,
          color: () => colors.depressed,
          strokeWidth: 2,
        },
        {
          data: mixedData,
          color: () => colors.mixed,
          strokeWidth: 2,
        },
      ],
    };
  };
  
  const totalDays = entries.length;
  const hasEnoughData = totalDays >= 14;
  const distribution = getMoodDistribution();
  const averages = getAverageScores();
  const chartData = getChartData();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pattern Insights</Text>
          <Text style={styles.subtitle}>
            Discover connections between your cycle and mood symptoms
          </Text>
        </View>
        
        {!hasEnoughData && (
          <Card style={styles.warningCard}>
            <View style={styles.warningHeader}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.warningTitle}>Early Data</Text>
            </View>
            <Text style={styles.warningText}>
              You've tracked {totalDays} {totalDays === 1 ? 'day' : 'days'}. 
              Keep tracking for at least 14 days to see meaningful patterns.
            </Text>
          </Card>
        )}
        
        {/* Mood Scores Over Time - Line Chart */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Mood Scores Over Time</Text>
          <Text style={styles.cardSubtitle}>Track how your mood symptoms change across your cycle phases</Text>
          
          {totalDays > 0 ? (
            <>
              <LineChart
                data={chartData}
                width={screenWidth - spacing.lg * 4}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundColor: colors.background,
                  backgroundGradientFrom: colors.background,
                  backgroundGradientTo: colors.background,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(155, 143, 181, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                  style: {
                    borderRadius: borderRadius.lg,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: colors.border,
                    strokeWidth: 1,
                  },
                }}
                bezier
                style={styles.chart}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                fromZero
                segments={5}
              />
              
              {/* Legend for Line Chart */}
              <View style={styles.chartLegend}>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: colors.elevated }]} />
                    <Text style={styles.legendText}>Mania Score</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: colors.depressed }]} />
                    <Text style={styles.legendText}>Depression Score</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendLine, { backgroundColor: colors.mixed }]} />
                    <Text style={styles.legendText}>Mixed Score</Text>
                  </View>
                </View>
                
                {/* Cycle Phase Legend */}
                <View style={styles.cyclePhaseLegend}>
                  <View style={styles.cyclePhaseItem}>
                    <View style={[styles.cyclePhaseBox, { backgroundColor: '#FFCDD2' }]} />
                    <Text style={styles.cyclePhaseText}>Menstruation</Text>
                  </View>
                  <View style={styles.cyclePhaseItem}>
                    <View style={[styles.cyclePhaseBox, { backgroundColor: '#C8E6C9' }]} />
                    <Text style={styles.cyclePhaseText}>Follicular</Text>
                  </View>
                  <View style={styles.cyclePhaseItem}>
                    <View style={[styles.cyclePhaseBox, { backgroundColor: '#E1BEE7' }]} />
                    <Text style={styles.cyclePhaseText}>Ovulation</Text>
                  </View>
                  <View style={styles.cyclePhaseItem}>
                    <View style={[styles.cyclePhaseBox, { backgroundColor: '#BBDEFB' }]} />
                    <Text style={styles.cyclePhaseText}>Luteal</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.emptyChart}>No data yet. Start tracking to see your mood patterns over time!</Text>
          )}
        </Card>
        
        {/* Mood Distribution Bar Chart */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Mood Distribution</Text>
          <Text style={styles.cardSubtitle}>Last {totalDays} days</Text>
          
          {totalDays > 0 ? (
            <BarChart
              data={{
                labels: ['Elevated', 'Depressed', 'Mixed', 'Baseline'],
                datasets: [{
                  data: [
                    distribution.elevated || 0,
                    distribution.depressed || 0,
                    distribution.mixed || 0,
                    distribution.baseline || 1, // At least 1 to show the chart
                  ],
                }],
              }}
              width={screenWidth - spacing.lg * 4}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" days"
              chartConfig={{
                backgroundColor: colors.background,
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(155, 143, 181, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
                style: {
                  borderRadius: borderRadius.lg,
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: colors.border,
                  strokeWidth: 1,
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              style={styles.chart}
              fromZero
              showBarTops={false}
              withInnerLines={true}
            />
          ) : (
            <Text style={styles.emptyChart}>No data yet. Start tracking to see charts!</Text>
          )}
        </Card>
        
        {/* Average Scores */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Average Symptom Scores</Text>
          
          {totalDays > 0 ? (
            <View style={styles.scoresContainer}>
              <ScoreItem label="Mania" score={averages.mania} maxScore="9" color={colors.elevated} />
              <ScoreItem label="Depression" score={averages.depression} maxScore="8" color={colors.depressed} />
              <ScoreItem label="Mixed" score={averages.mixed} maxScore="4" color={colors.mixed} />
            </View>
          ) : (
            <Text style={styles.emptyChart}>No data yet. Complete check-ins to see scores!</Text>
          )}
        </Card>
        
        {/* Detected Patterns */}
        {patterns.length > 0 && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Detected Patterns</Text>
            {patterns.map(pattern => (
              <View key={pattern.id} style={styles.patternItem}>
                <View style={styles.patternHeader}>
                  <Text style={styles.patternTitle}>{pattern.title}</Text>
                  <Badge variant={pattern.confidence === 'high' ? 'success' : 'info'}>
                    {pattern.confidence} confidence
                  </Badge>
                </View>
                <Text style={styles.patternDescription}>{pattern.description}</Text>
              </View>
            ))}
          </Card>
        )}
        
        {patterns.length === 0 && hasEnoughData && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Detected Patterns</Text>
            <Text style={styles.noPatterns}>
              No clear patterns detected yet. Keep tracking to see connections between your cycle and mood.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface ScoreItemProps {
  label: string;
  score: string;
  maxScore: string;
  color: string;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, score, maxScore, color }) => (
  <View style={styles.scoreItem}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <Text style={[styles.scoreValue, { color }]}>
      {score}/{maxScore}
    </Text>
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
  warningCard: {
    backgroundColor: '#F3E8FF',
    borderColor: '#E9D5FF',
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  warningTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  warningText: {
    fontSize: typography.fontSize.small,
    color: '#6B21A8',
    lineHeight: 20,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  chart: {
    marginVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  chartLegend: {
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: typography.fontSize.tiny,
    color: colors.textLight,
  },
  cyclePhaseLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: spacing.sm,
  },
  cyclePhaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cyclePhaseBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  cyclePhaseText: {
    fontSize: typography.fontSize.tiny,
    color: colors.textLight,
  },
  emptyChart: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    fontSize: typography.fontSize.h2,
    fontWeight: typography.fontWeight.bold,
  },
  patternItem: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  patternTitle: {
    flex: 1,
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginRight: spacing.sm,
  },
  patternDescription: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    lineHeight: 20,
  },
  noPatterns: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
