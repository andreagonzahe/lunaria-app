import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { ConditionsScreen } from './ConditionsScreen';
import { CycleSetupScreen } from './CycleSetupScreen';
import { MedicationsScreen } from './MedicationsScreen';
import { SafetyPlanScreen } from './SafetyPlanScreen';
import { syncUserProfile, syncMedications, syncSafetyPlan } from '../../services/cloudStorage';
import type { UserProfile, Medication, SafetyPlan } from '../../types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<UserProfile>>({});
  const [medications, setMedicationsData] = useState<Medication[]>([]);
  
  const handleWelcomeNext = () => {
    setCurrentStep(1);
  };
  
  const handleConditionsNext = (diagnosis: UserProfile['diagnosis']) => {
    setOnboardingData({ ...onboardingData, diagnosis });
    setCurrentStep(2);
  };
  
  const handleCycleSetupNext = (data: {
    cyclePreference: 'auto' | 'manual';
    hasIrregularCycles: boolean;
    lastPeriodDate: string | null;
  }) => {
    setOnboardingData({
      ...onboardingData,
      cycleTracking: {
        isAutomatic: data.cyclePreference === 'auto',
        isIrregular: data.hasIrregularCycles,
        lastPeriodDate: data.lastPeriodDate || undefined,
        averageCycleLength: 28,
      },
    });
    setCurrentStep(3);
  };
  
  const handleMedicationsNext = (meds: Medication[]) => {
    setMedicationsData(meds);
    setCurrentStep(4);
  };
  
  const handleSafetyPlanComplete = async (data: {
    safetyPlan: string | null;
    safetyPlanImage: string | null;
    emergencyContact: string | null;
  }) => {
    try {
      // Save user profile
      const profile: UserProfile = {
        id: Date.now().toString(),
        diagnosis: onboardingData.diagnosis || 'other',
        onboardingComplete: true,
        cycleTracking: onboardingData.cycleTracking || {
          isAutomatic: false,
          isIrregular: false,
          averageCycleLength: 28,
        },
        createdAt: new Date().toISOString(),
      };
      
      await syncUserProfile(profile);
      
      // Save medications if any
      if (medications.length > 0) {
        await syncMedications(medications);
      }
      
      // Save safety plan if provided
      if (data.safetyPlan || data.safetyPlanImage) {
        const safetyPlan: SafetyPlan = {
          content: data.safetyPlan || '',
          format: data.safetyPlanImage ? 'image' : 'text',
          fileUri: data.safetyPlanImage || undefined,
          emergencyContact: data.emergencyContact ? {
            name: data.emergencyContact.split(',')[0] || '',
            phone: data.emergencyContact.split(',')[1] || '',
          } : undefined,
          updatedAt: new Date().toISOString(),
        };
        
        await syncSafetyPlan(safetyPlan);
      }
      
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      {currentStep === 0 && <WelcomeScreen onNext={handleWelcomeNext} />}
      {currentStep === 1 && (
        <ConditionsScreen
          onNext={handleConditionsNext}
          onBack={() => setCurrentStep(0)}
        />
      )}
      {currentStep === 2 && (
        <CycleSetupScreen
          onNext={handleCycleSetupNext}
          onBack={() => setCurrentStep(1)}
        />
      )}
      {currentStep === 3 && (
        <MedicationsScreen
          onNext={handleMedicationsNext}
          onBack={() => setCurrentStep(2)}
        />
      )}
      {currentStep === 4 && (
        <SafetyPlanScreen
          onComplete={handleSafetyPlanComplete}
          onBack={() => setCurrentStep(3)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
