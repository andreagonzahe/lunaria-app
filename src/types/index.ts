// User profile
export interface UserProfile {
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
}

// Medication
export interface Medication {
  id: string;
  name: string;
  dose: string;
  times: string[]; // Array of times like ["09:00", "21:00"]
  remindersEnabled: boolean;
  isPRN: boolean;
}

// Cycle phase type
export type CyclePhase = 'follicular' | 'ovulation' | 'luteal' | 'menstruation';

// Mood state type
export type MoodState = 'elevated' | 'depressed' | 'mixed' | 'baseline' | 'safety-alert';

// Mood entry
export interface MoodEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  timestamp: number;
  
  // Questionnaire sections (true = checked)
  sectionA: boolean[]; // 9 items - Mania/Hypomania
  sectionB: boolean[]; // 8 items - Depression
  sectionC: boolean[]; // 4 items - Mixed/Anxiety
  sectionD: boolean;   // 1 item - Safety flag
  
  // Calculated scores
  scores: {
    mania: number;      // 0-9
    depression: number; // 0-8
    mixed: number;      // 0-4
  };
  
  moodState: MoodState;
  
  // Additional tracking
  cyclePhase?: CyclePhase;
  sleep?: {
    hours: number;
    quality: 'good' | 'medium' | 'bad';
  };
  medicationsTaken?: { [medicationId: string]: boolean };
}

// Pattern detection
export interface Pattern {
  id: string;
  type: 'cycle-mood' | 'sleep-mood' | 'medication-mood' | 'custom';
  description: string;
  confidence: 'high' | 'medium' | 'low';
  frequency: number; // How many times observed
  totalOccurrences: number; // Out of how many opportunities
  examples: string[]; // Dates when pattern occurred
  detectedAt: string; // ISO date when pattern was detected
}

// Safety plan
export interface SafetyPlan {
  content: string;
  format: 'text' | 'pdf' | 'image';
  fileUri?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  updatedAt: string;
}

// Navigation types (we'll expand this as we build)
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Insights: undefined;
  Track: undefined;
  Profile: undefined;
};
