import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Button, Card, Input } from '../../components';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

interface SafetyPlanScreenProps {
  onComplete: (data: {
    safetyPlan: string | null;
    safetyPlanImage: string | null;
    emergencyContact: string | null;
  }) => void;
  onBack: () => void;
}

export const SafetyPlanScreen: React.FC<SafetyPlanScreenProps> = ({ onComplete, onBack }) => {
  const [safetyPlan, setSafetyPlan] = useState('');
  const [safetyPlanImage, setSafetyPlanImage] = useState<string | null>(null);
  const [emergencyContact, setEmergencyContact] = useState('');
  
  const handleComplete = () => {
    onComplete({
      safetyPlan: safetyPlan || null,
      safetyPlanImage: safetyPlanImage,
      emergencyContact: emergencyContact || null,
    });
  };
  
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/plain'],
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSafetyPlanImage(file.uri);
        Alert.alert('Success', 'Safety plan file uploaded successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload file');
      console.error(error);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Text style={styles.title}>Safety Plan</Text>
          <Text style={styles.subtitle}>
            Having a safety plan is important for managing difficult moments (optional)
          </Text>
          
          {/* Crisis Resources */}
          <View style={styles.crisisBox}>
            <View style={styles.crisisHeader}>
              <Ionicons name="warning" size={20} color="#991B1B" />
              <Text style={styles.crisisTitle}>Immediate Help:</Text>
            </View>
            <Text style={styles.crisisText}>• Call 988 (Suicide & Crisis Lifeline)</Text>
            <Text style={styles.crisisText}>• Text HOME to 741741 (Crisis Text Line)</Text>
            <Text style={styles.crisisText}>• Call 911 if in immediate danger</Text>
          </View>
          
          {/* Upload Safety Plan */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Upload Existing Safety Plan</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadText}>
                {safetyPlanImage ? 'File uploaded' : 'Upload PDF, image, or text file'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Or Type It */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Or Type Your Safety Plan</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Enter your safety plan here..."
              value={safetyPlan}
              onChangeText={setSafetyPlan}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={colors.textLight}
            />
          </View>
          
          {/* Emergency Contact */}
          <View style={styles.section}>
            <Input
              label="Emergency Contact (Optional)"
              placeholder="Name and phone number"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
            />
          </View>
          
          {/* Info Box */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>What is a safety plan?</Text> A safety plan is a personalized, 
              practical plan to help you cope with suicidal thoughts and keep yourself safe. It typically includes 
              warning signs, coping strategies, people to contact, and ways to make your environment safer.
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
              title="Complete Setup"
              onPress={handleComplete}
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
  crisisBox: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  crisisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  crisisTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: '#991B1B',
    marginLeft: spacing.sm,
  },
  crisisText: {
    fontSize: typography.fontSize.small,
    color: '#991B1B',
    marginBottom: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: typography.fontSize.body,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.body,
    color: colors.textDark,
    backgroundColor: colors.background,
    minHeight: 120,
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
