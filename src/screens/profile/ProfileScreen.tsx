import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, Image } from 'react-native';
import { Button, Card, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { getUserProfile, getMedications, syncMedications, signOut } from '../../services/cloudStorage';
import { clearAllData } from '../../services/storage';
import { Ionicons } from '@expo/vector-icons';
import type { UserProfile, Medication } from '../../types';

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigate?: (screen: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout, onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [medications, setMedicationsData] = useState<Medication[]>([]);
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  const loadProfile = async () => {
    const userProfile = await getUserProfile();
    const meds = await getMedications();
    setProfile(userProfile);
    setMedicationsData(meds);
  };
  
  const handleClearData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your data? This will log you out and cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            await signOut();
            onLogout();
          },
        },
      ]
    );
  };
  
  const getDiagnosisLabel = (diagnosis: string) => {
    const labels: { [key: string]: string } = {
      'bipolar-1': 'Bipolar I Disorder',
      'bipolar-2': 'Bipolar II Disorder',
      'cyclothymia': 'Cyclothymia',
      'other': 'Other',
    };
    return labels[diagnosis] || diagnosis;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/lunaria-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Profile</Text>
        </View>
        
        {/* Profile Information */}
        {profile && (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Your Information</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Diagnosis:</Text>
              <Text style={styles.infoValue}>{getDiagnosisLabel(profile.diagnosis)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cycle Tracking:</Text>
              <Text style={styles.infoValue}>
                {profile.cycleTracking.isAutomatic ? 'Automatic' : 'Manual'}
              </Text>
            </View>
            
            {profile.cycleTracking.isIrregular && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Irregular Cycles:</Text>
                <Text style={styles.infoValue}>Yes</Text>
              </View>
            )}
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since:</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </Card>
        )}
        
        {/* Medications */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="medical" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Medications</Text>
          </View>
          
          {medications.length > 0 ? (
            medications.map((med) => (
              <View key={med.id} style={styles.medItem}>
                <View>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medDetails}>
                    {med.dose} {med.isPRN ? '(PRN)' : `• ${med.times.join(', ')}`}
                  </Text>
                </View>
                {med.remindersEnabled && (
                  <Ionicons name="notifications" size={16} color={colors.primary} />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No medications added</Text>
          )}
        </Card>
        
        {/* App Settings */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="settings" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>App Settings</Text>
          </View>
          
          <Button
            title="Export Data"
            variant="outline"
            onPress={() => Alert.alert('Export', 'Export feature coming soon!')}
            style={styles.settingButton}
          />
          
          <Button
            title="Privacy Policy"
            variant="outline"
            onPress={() => onNavigate?.('PrivacyPolicy')}
            style={styles.settingButton}
          />
          
          <Button
            title="About Lunaria"
            variant="outline"
            onPress={() => onNavigate?.('About')}
            style={styles.settingButton}
          />
        </Card>
        
        {/* Danger Zone */}
        <Card style={[styles.card, styles.dangerCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="warning" size={24} color={colors.warning} />
            <Text style={[styles.cardTitle, { color: colors.warning }]}>Danger Zone</Text>
          </View>
          
          <Text style={styles.dangerText}>
            Deleting your data will permanently remove all mood entries, medications, and settings. This action cannot be undone.
          </Text>
          
          <Button
            title="Clear All Data & Reset"
            onPress={handleClearData}
            variant="outline"
            style={styles.dangerButton}
            textStyle={{ color: colors.warning }}
          />
        </Card>
        
        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 140,
    height: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  infoLabel: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
  },
  medItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
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
  emptyText: {
    fontSize: typography.fontSize.body,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  settingButton: {
    marginBottom: spacing.sm,
  },
  dangerCard: {
    borderColor: colors.warning,
    borderWidth: 1,
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    fontSize: typography.fontSize.small,
    color: colors.textLight,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  dangerButton: {
    borderColor: colors.warning,
  },
  version: {
    fontSize: typography.fontSize.tiny,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
