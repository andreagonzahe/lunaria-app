import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../../constants/theme';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.switch,
        value && styles.switchActive,
        disabled && styles.switchDisabled,
      ]}
      onPress={() => !disabled && onValueChange(!value)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[
          styles.thumb,
          value && styles.thumbActive,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 48,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.disabled,
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: colors.primary,
  },
  switchDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  thumbActive: {
    transform: [{ translateX: 20 }],
  },
});
