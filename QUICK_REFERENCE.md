# Lunaria - Quick Reference Guide

## 📁 Project Structure

```
lunaria-app/
├── App.tsx                          # Main entry point
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
│
├── src/
│   ├── components/                  # UI Components
│   │   ├── common/                  # Reusable components
│   │   │   ├── Button.tsx          # [TO BUILD] Primary/secondary buttons
│   │   │   ├── Card.tsx            # [TO BUILD] Container component
│   │   │   ├── Input.tsx           # [TO BUILD] Text input
│   │   │   ├── Checkbox.tsx        # [TO BUILD] Checkbox for questionnaire
│   │   │   └── ...
│   │   ├── mood/                    # Mood-specific components
│   │   ├── insights/                # Insights components
│   │   └── profile/                 # Profile components
│   │
│   ├── screens/                     # Application Screens
│   │   ├── onboarding/             # Onboarding flow
│   │   │   ├── WelcomeScreen.tsx   # [TO BUILD] Welcome screen
│   │   │   ├── DiagnosisScreen.tsx # [TO BUILD] Select diagnosis
│   │   │   ├── CycleSetupScreen.tsx# [TO BUILD] Cycle tracking setup
│   │   │   ├── MedicationsScreen.tsx# [TO BUILD] Add medications
│   │   │   └── SafetyPlanScreen.tsx# [TO BUILD] Safety plan
│   │   ├── home/                   # Home dashboard
│   │   ├── mood/                   # Mood tracking screens
│   │   ├── insights/               # Pattern analysis
│   │   ├── history/                # Calendar/history view
│   │   └── profile/                # Settings & profile
│   │
│   ├── navigation/
│   │   └── AppNavigator.tsx        # ✅ Navigation setup (stack + tabs)
│   │
│   ├── services/
│   │   └── storage.ts              # ✅ AsyncStorage & SecureStore service
│   │
│   ├── constants/
│   │   ├── theme.ts                # ✅ Colors, typography, spacing
│   │   └── moodData.ts             # ✅ Questionnaire & scoring logic
│   │
│   ├── types/
│   │   └── index.ts                # ✅ All TypeScript interfaces
│   │
│   ├── utils/                      # Helper functions
│   ├── hooks/                      # Custom React hooks
│   └── store/                      # Zustand state stores
│
└── assets/                         # Images, fonts, etc.
```

## 🎨 Design Tokens (theme.ts)

### Colors
```typescript
import { colors } from '../constants/theme';

colors.primary        // #4A90E2 - Calming blue
colors.secondary      // #5DADE2 - Teal
colors.accent         // #A8D5BA - Soft green

colors.elevated       // #FFB84D - Orange (mania)
colors.depressed      // #6B9BD1 - Blue (depression)
colors.mixed          // #B19CD9 - Purple (mixed)
colors.baseline       // #A8D5BA - Green (baseline)

colors.warning        // #E74C3C - Red (safety)
colors.success        // #27AE60 - Green
colors.textDark       // #2C3E50
colors.textLight      // #6B7280
colors.background     // #FFFFFF
colors.surface        // #F7FAFC
colors.border         // #E5E7EB
```

### Typography
```typescript
import { typography } from '../constants/theme';

typography.fontSize.h1        // 32
typography.fontSize.h2        // 24
typography.fontSize.h3        // 20
typography.fontSize.body      // 16
typography.fontSize.small     // 14
typography.fontSize.tiny      // 12

typography.fontWeight.regular    // '400'
typography.fontWeight.medium     // '500'
typography.fontWeight.semibold   // '600'
typography.fontWeight.bold       // '700'
```

### Spacing
```typescript
import { spacing } from '../constants/theme';

spacing.xs    // 4
spacing.sm    // 8
spacing.md    // 16
spacing.lg    // 24
spacing.xl    // 32
spacing.xxl   // 48
```

### Border Radius
```typescript
import { borderRadius } from '../constants/theme';

borderRadius.sm    // 4
borderRadius.md    // 8
borderRadius.lg    // 12
borderRadius.xl    // 16
borderRadius.full  // 9999
```

### Shadows
```typescript
import { shadows } from '../constants/theme';

...shadows.small   // Subtle shadow
...shadows.medium  // Medium shadow
...shadows.large   // Prominent shadow
```

## 📦 TypeScript Types

### User Profile
```typescript
import { UserProfile } from '../types';

const profile: UserProfile = {
  id: string;
  diagnosis: 'bipolar-1' | 'bipolar-2' | 'cyclothymia' | 'other';
  diagnosisOther?: string;
  onboardingComplete: boolean;
  cycleTracking: {
    isAutomatic: boolean;
    isIrregular: boolean;
    lastPeriodDate?: string;
    averageCycleLength: number;
  };
  createdAt: string;
};
```

### Mood Entry
```typescript
import { MoodEntry } from '../types';

const entry: MoodEntry = {
  id: string;
  date: string;              // YYYY-MM-DD
  timestamp: number;
  sectionA: boolean[];       // 9 items (mania)
  sectionB: boolean[];       // 8 items (depression)
  sectionC: boolean[];       // 4 items (mixed)
  sectionD: boolean;         // 1 item (safety)
  scores: {
    mania: number;           // 0-9
    depression: number;      // 0-8
    mixed: number;           // 0-4
  };
  moodState: 'elevated' | 'depressed' | 'mixed' | 'baseline' | 'safety-alert';
  cyclePhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstruation';
  sleep?: {
    hours: number;
    quality: 'good' | 'medium' | 'bad';
  };
  medicationsTaken?: { [medicationId: string]: boolean };
};
```

### Medication
```typescript
import { Medication } from '../types';

const med: Medication = {
  id: string;
  name: string;
  dose: string;
  times: string[];           // ["09:00", "21:00"]
  remindersEnabled: boolean;
  isPRN: boolean;
};
```

## 📊 Mood Questionnaire

```typescript
import { MOOD_QUESTIONNAIRE, classifyMoodState } from '../constants/moodData';

// Access questionnaire sections
MOOD_QUESTIONNAIRE.sectionA.items    // 9 mania items
MOOD_QUESTIONNAIRE.sectionB.items    // 8 depression items
MOOD_QUESTIONNAIRE.sectionC.items    // 4 mixed items
MOOD_QUESTIONNAIRE.sectionD.items    // 1 safety item

// Classify mood state
const moodState = classifyMoodState({
  mania: 5,
  depression: 2,
  mixed: 1,
  safety: false,
}); // Returns: 'elevated' | 'depressed' | 'mixed' | 'baseline' | 'safety-alert'
```

## 💾 Storage Service

```typescript
import {
  saveUserProfile,
  getUserProfile,
  saveMoodEntry,
  getMoodEntries,
  saveMedications,
  getMedications,
  saveSafetyPlan,
  getSafetyPlan,
  clearAllData,
} from '../services/storage';

// User profile
await saveUserProfile(profile);
const profile = await getUserProfile();

// Mood entries
await saveMoodEntry(entry);
const entries = await getMoodEntries(); // All entries
const filtered = await getMoodEntries(startDate, endDate); // Filtered

// Medications
await saveMedications([med1, med2]);
const meds = await getMedications();

// Safety plan (SecureStore)
await saveSafetyPlan(plan);
const plan = await getSafetyPlan();

// Clear all
await clearAllData();
```

## 🧭 Navigation

```typescript
import { useNavigation } from '@react-navigation/native';

// In a component
const navigation = useNavigation();

// Navigate to screens
navigation.navigate('Home');
navigation.navigate('Insights');
navigation.navigate('Track');
navigation.navigate('Profile');

// Go back
navigation.goBack();
```

## 🛠️ Common Patterns

### Component Template
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface MyComponentProps {
  title: string;
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  title: {
    fontSize: typography.fontSize.h3,
    fontWeight: typography.fontWeight.bold,
    color: colors.background,
  },
});
```

### Screen Template
```typescript
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, typography, spacing } from '../../constants/theme';

export const MyScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Screen Title</Text>
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
  },
  title: {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
});
```

## 🎯 Development Workflow

1. **Check Figma designs** for the component/screen you're building
2. **Create the component file** in appropriate folder
3. **Import theme constants** (never hardcode colors/spacing)
4. **Use TypeScript types** from `src/types/index.ts`
5. **Test on device** with Expo Go
6. **Commit your changes** with clear message

## 📝 Quick Commands

```bash
# Navigate to project
cd /Users/andreagonzalezh/Documents/Lunaria/lunaria-app

# Start dev server
npx expo start

# Start for web
npx expo start --web

# Clear cache
npx expo start --clear

# Install package
npx expo install package-name
```

## 🔗 Key Files to Reference

- `src/constants/theme.ts` - All design tokens
- `src/types/index.ts` - All TypeScript types
- `src/constants/moodData.ts` - Questionnaire data
- `src/services/storage.ts` - Data persistence
- `src/navigation/AppNavigator.tsx` - Navigation setup

## 📖 External Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

**Keep this file handy as you build! 🚀**
