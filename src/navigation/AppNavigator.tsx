import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { getUserProfile } from '../services/cloudStorage';
import { getCurrentUser, signOut, syncAllData } from '../services/cloudStorage';
import { colors } from '../constants/theme';
import AuthFlow from '../screens/auth/AuthFlow';
import { OnboardingFlow } from '../screens/onboarding/OnboardingFlow';
import { HomeScreen } from '../screens/home/HomeScreen';
import { InsightsScreen } from '../screens/insights/InsightsScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { PrivacyPolicyScreen } from '../screens/profile/PrivacyPolicyScreen';
import { AboutScreen } from '../screens/profile/AboutScreen';
import { MoodCheckInScreen } from '../screens/mood/MoodCheckInScreen';
import { BottomNav } from '../components/BottomNav';
import { supabase } from '../lib/supabase';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [currentScreen, setCurrentScreen] = useState('Home');
  
  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        // User logged in - sync data and check onboarding
        syncAllData().then(() => checkOnboardingStatus());
      } else {
        // User logged out
        setHasCompletedOnboarding(null);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const checkAuthStatus = async () => {
    const user = await getCurrentUser();
    setIsAuthenticated(!!user);
    if (user) {
      await syncAllData();
      await checkOnboardingStatus();
    }
  };
  
  const checkOnboardingStatus = async () => {
    try {
      const profile = await getUserProfile();
      setHasCompletedOnboarding(profile?.onboardingComplete ?? false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setHasCompletedOnboarding(false);
    }
  };
  
  const handleAuthComplete = async () => {
    setIsAuthenticated(true);
    await syncAllData();
    await checkOnboardingStatus();
  };
  
  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };
  
  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };
  
  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setHasCompletedOnboarding(null);
    setCurrentScreen('Home');
  };
  
  // Loading state
  if (isAuthenticated === null || (isAuthenticated && hasCompletedOnboarding === null)) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  // Authentication flow
  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <AuthFlow onComplete={handleAuthComplete} />
      </NavigationContainer>
    );
  }
  
  // Onboarding flow
  if (!hasCompletedOnboarding) {
    return (
      <NavigationContainer>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </NavigationContainer>
    );
  }
  
  // Main app with bottom navigation
  return (
    <NavigationContainer>
      <View style={styles.container}>
        {currentScreen === 'Home' && <HomeScreen onNavigate={handleNavigate} />}
        {currentScreen === 'Insights' && <InsightsScreen />}
        {currentScreen === 'Track' && <HistoryScreen />}
        {currentScreen === 'Profile' && <ProfileScreen onLogout={handleLogout} onNavigate={handleNavigate} />}
        {currentScreen === 'MoodCheckIn' && (
          <MoodCheckInScreen
            onComplete={() => handleNavigate('Home')}
            onBack={() => handleNavigate('Home')}
          />
        )}
        {currentScreen === 'PrivacyPolicy' && (
          <PrivacyPolicyScreen onBack={() => handleNavigate('Profile')} />
        )}
        {currentScreen === 'About' && (
          <AboutScreen onBack={() => handleNavigate('Profile')} />
        )}
        
        {currentScreen !== 'MoodCheckIn' && currentScreen !== 'PrivacyPolicy' && currentScreen !== 'About' && (
          <BottomNav currentRoute={currentScreen} onNavigate={handleNavigate} />
        )}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
  },
});
