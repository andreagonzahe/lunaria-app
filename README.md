# Lunaria - React Native App

A React Native + Expo + TypeScript app that helps people with bipolar disorder track the connection between their menstrual cycle and mood episodes.

## 🎯 Project Overview

**App Name:** Lunaria

**Purpose:** Help individuals with Bipolar I, II, or Cyclothymia who have female hormones discover patterns between their hormonal cycle phases and mood symptoms.

## ✅ Initial Setup Complete

This project has been fully initialized with the following:

### 1. **Project Structure**
```
/src
  /components          # Reusable UI components
    /common           # Generic components (Button, Card, Input, etc.)
    /mood             # Mood check-in specific components
    /insights         # Pattern detection components
    /profile          # Profile/settings components
  /screens            # Application screens
    /onboarding       # Onboarding flow screens
    /home             # Main dashboard
    /mood             # Mood tracking screens
    /insights         # Pattern analysis screens
    /history          # Calendar/history view
    /profile          # Settings and profile
  /navigation         # Navigation configuration
  /store              # Zustand state management
  /services           # Storage, notifications, export services
  /utils              # Helper functions
  /constants          # Design system and data
  /types              # TypeScript type definitions
  /hooks              # Custom React hooks
```

### 2. **Dependencies Installed**

#### Navigation
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

#### UI & Components
- `react-native-paper`
- `@shopify/flash-list`
- `@expo/vector-icons`

#### Forms & State
- `react-hook-form`
- `yup`
- `@hookform/resolvers`
- `zustand`

#### Data & Storage
- `@react-native-async-storage/async-storage`
- `expo-secure-store`
- `date-fns`

#### Notifications & Files
- `expo-notifications`
- `expo-file-system`
- `expo-document-picker`

#### Charts & Calendar
- `react-native-chart-kit`
- `react-native-svg`
- `react-native-calendars`

### 3. **Core Files Created**

#### Theme & Design System (`src/constants/theme.ts`)
- Complete color palette (brand colors, mood state colors, UI colors)
- Typography system (font sizes, weights)
- Spacing system
- Border radius definitions
- Shadow styles

#### TypeScript Types (`src/types/index.ts`)
- `UserProfile` - User data and preferences
- `Medication` - Medication tracking
- `MoodEntry` - Daily mood check-in data
- `Pattern` - AI-detected patterns
- `SafetyPlan` - Crisis resources
- Navigation types

#### Mood Questionnaire (`src/constants/moodData.ts`)
- Complete 22-item questionnaire (4 sections)
- Section A: Mania/Hypomania (9 items)
- Section B: Depression (8 items)
- Section C: Mixed features/Anxiety (4 items)
- Section D: Safety (1 item)
- Scoring thresholds
- `classifyMoodState()` function for mood state detection

#### Storage Service (`src/services/storage.ts`)
- User profile management
- Mood entry CRUD operations
- Medication management
- Safety plan storage (SecureStore)
- Data clearing functionality

#### Navigation (`src/navigation/AppNavigator.tsx`)
- Stack navigation (Onboarding → Main)
- Bottom tab navigation (Home, Insights, Track, Profile)
- Onboarding status checking
- Placeholder screens for all tabs

#### App Entry Point (`App.tsx`)
- Main app component
- Navigation integration
- Status bar configuration

## 🚀 Getting Started

### Run the Development Server

```bash
cd lunaria-app
npx expo start
```

Then scan the QR code with Expo Go on your iOS device, or press `i` to open in iOS Simulator.

### Available Scripts

- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web

## 📱 App Features (To Be Implemented)

### Core Features
- ✅ **Daily mood check-in** - 4-section questionnaire
- ✅ **Automatic menstrual cycle tracking**
- ✅ **Medication adherence tracking** with reminders
- ✅ **Sleep logging**
- ✅ **AI-powered pattern detection** (cycle phase ↔ mood correlations)
- ✅ **Early warning alerts** before predicted episodes
- ✅ **Crisis safety resources** (safety plan, emergency contacts)
- ✅ **Customizable PDF reports** for clinicians
- ✅ **Offline-first functionality**

## 🎨 Design System

### Colors
- **Primary Brand:** Calming blue (#4A90E2)
- **Mood States:**
  - Elevated/Hypomanic: Warm orange (#FFB84D)
  - Depressed: Cool blue (#6B9BD1)
  - Mixed: Purple (#B19CD9)
  - Baseline: Soft green (#A8D5BA)
- **Safety Alert:** Red (#E74C3C)

### Typography
- H1: 32px
- H2: 24px
- H3: 20px
- Body: 16px
- Small: 14px
- Tiny: 12px

## 📋 Next Steps

1. **Build common UI components** (Button, Card, Input, etc.)
2. **Create onboarding screens** (Welcome, Conditions, Medications, Safety Plan)
3. **Build the daily mood check-in flow**
4. **Implement the home dashboard**
5. **Add cycle tracking calculations**
6. **Build insights/pattern detection**
7. **Create the history/calendar view**
8. **Implement notifications**
9. **Add PDF export functionality**
10. **Polish and test everything**

## 📖 Documentation

- **Figma Designs:** Available in `../Lunaria Figma Files/` directory
- **Specification Document:** Available in `../Specs/` directory
- **Guidelines:** See `../Lunaria Figma Files/guidelines/Guidelines.md`

## 🌙 About Lunaria

Lunaria is designed to help individuals with bipolar disorder understand the relationship between their hormonal cycle and mood symptoms, empowering them with data-driven insights to better manage their condition.

---

**Status:** ✅ Initial setup complete - Ready to start building features!
