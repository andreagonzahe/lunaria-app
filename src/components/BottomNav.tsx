import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, shadows } from '../constants/theme';

interface BottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

interface NavItem {
  route: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFilled: keyof typeof Ionicons.glyphMap;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, onNavigate }) => {
  const navItems: NavItem[] = [
    {
      route: 'Home',
      label: 'Home',
      icon: 'home-outline',
      iconFilled: 'home',
    },
    {
      route: 'Insights',
      label: 'Insights',
      icon: 'trending-up-outline',
      iconFilled: 'trending-up',
    },
    {
      route: 'Track',
      label: 'Track',
      icon: 'calendar-outline',
      iconFilled: 'calendar',
    },
    {
      route: 'Profile',
      label: 'Profile',
      icon: 'person-outline',
      iconFilled: 'person',
    },
  ];
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {navItems.map((item) => {
          const isActive = currentRoute === item.route;
          
          return (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              onPress={() => onNavigate(item.route)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? item.iconFilled : item.icon}
                size={24}
                color={isActive ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.large,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm + 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.tiny,
    fontWeight: typography.fontWeight.medium,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  labelActive: {
    color: colors.primary,
  },
});
