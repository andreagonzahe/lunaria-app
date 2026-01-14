export const colors = {
  // Primary brand colors
  primary: '#9B8FB5',      // Soft purple/lilac (matches logo)
  secondary: '#B19CD9',    // Lavender
  accent: '#A8D5BA',       // Soft green
  
  // Mood state colors (for data visualization and UI)
  elevated: '#FFB84D',     // Warm orange (mania/hypomania)
  depressed: '#7B9FCC',    // Cool blue (depression)
  mixed: '#C5B3E6',        // Light purple (mixed features)
  baseline: '#A8D5BA',     // Soft green (baseline)
  
  // UI colors
  warning: '#E74C3C',      // Red for safety alerts
  success: '#27AE60',      // Green for positive states
  textDark: '#2C3E50',     // Dark text
  textLight: '#6B7280',    // Light gray text
  background: '#FFFFFF',   // White background
  surface: '#F7FAFC',      // Light gray for cards
  border: '#E5E7EB',       // Border gray
  disabled: '#D1D5DB',     // Disabled state
};

export const typography = {
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    small: 14,
    tiny: 12,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
