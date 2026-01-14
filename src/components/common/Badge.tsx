import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' };
      case 'warning':
        return { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' };
      case 'info':
        return { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' };
      default:
        return { backgroundColor: colors.surface, borderColor: colors.border };
    }
  };
  
  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return '#047857';
      case 'warning':
        return '#92400E';
      case 'info':
        return '#1E40AF';
      default:
        return colors.textDark;
    }
  };
  
  return (
    <View style={[styles.badge, getVariantStyle(), style]}>
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.fontSize.tiny,
    fontWeight: typography.fontWeight.semibold,
  },
});
