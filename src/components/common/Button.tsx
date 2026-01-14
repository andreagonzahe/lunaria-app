import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];
    
    // Size styles
    if (size === 'sm') baseStyle.push(styles.buttonSm);
    if (size === 'lg') baseStyle.push(styles.buttonLg);
    
    // Variant styles
    if (variant === 'default') baseStyle.push(styles.buttonDefault);
    if (variant === 'outline') baseStyle.push(styles.buttonOutline);
    if (variant === 'ghost') baseStyle.push(styles.buttonGhost);
    
    // Disabled style
    if (disabled || loading) baseStyle.push(styles.buttonDisabled);
    
    return baseStyle;
  };
  
  const getTextStyle = () => {
    const baseStyle = [styles.text];
    
    // Size text styles
    if (size === 'sm') baseStyle.push(styles.textSm);
    if (size === 'lg') baseStyle.push(styles.textLg);
    
    // Variant text styles
    if (variant === 'default') baseStyle.push(styles.textDefault);
    if (variant === 'outline') baseStyle.push(styles.textOutline);
    if (variant === 'ghost') baseStyle.push(styles.textGhost);
    
    return baseStyle;
  };
  
  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'default' ? colors.background : colors.primary}
          size="small"
        />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  buttonSm: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.sm,
  },
  buttonLg: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonDefault: {
    backgroundColor: colors.primary,
    ...shadows.small,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
  },
  textSm: {
    fontSize: typography.fontSize.small,
  },
  textLg: {
    fontSize: typography.fontSize.h3,
  },
  textDefault: {
    color: colors.background,
  },
  textOutline: {
    color: colors.textDark,
  },
  textGhost: {
    color: colors.primary,
  },
});
