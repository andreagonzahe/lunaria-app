import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';
import { Button, Card } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          {/* Lunaria Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/lunaria-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          {/* Title */}
          <Text style={styles.title}>Welcome to Lunaria</Text>
          <Text style={styles.subtitle}>
            A personal tracking tool to discover patterns between your menstrual cycle phases and mood episodes
          </Text>
          
          {/* What is Lunaria Section */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What is Lunaria?</Text>
            <Text style={styles.infoText}>
              Lunaria helps you track your mood symptoms alongside your hormonal cycle. 
              By logging your daily experiences, you can uncover patterns and share valuable insights with your healthcare provider.
            </Text>
          </View>
          
          {/* Key Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features:</Text>
            <View style={styles.featureList}>
              <FeatureItem text="Daily mood check-ins using validated questionnaire items" />
              <FeatureItem text="Automatic menstrual cycle phase tracking" />
              <FeatureItem text="Medication and sleep logging" />
              <FeatureItem text="AI-powered pattern detection" />
              <FeatureItem text="Early warning alerts for mood episodes" />
              <FeatureItem text="Customizable PDF reports for your clinician" />
            </View>
          </View>
          
          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              <Text style={styles.disclaimerBold}>Note:</Text> This app is a tracking tool and is not a substitute for professional medical advice. 
              Always consult with your healthcare provider about treatment decisions.
            </Text>
          </View>
          
          {/* Get Started Button */}
          <Button 
            title="Get Started" 
            onPress={onNext}
            size="lg"
            style={styles.button}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.checkmark}>✓</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

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
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
  },
  title: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  infoBox: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  infoTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: '#581C87',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.fontSize.small,
    color: '#6B21A8',
    lineHeight: 20,
  },
  section: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm + 4,
  },
  featureList: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkmark: {
    color: colors.success,
    fontSize: typography.fontSize.body,
    marginRight: spacing.sm,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    width: '100%',
  },
  disclaimerText: {
    fontSize: typography.fontSize.small,
    color: '#92400E',
    lineHeight: 20,
  },
  disclaimerBold: {
    fontWeight: typography.fontWeight.bold,
  },
  button: {
    width: '100%',
  },
});
