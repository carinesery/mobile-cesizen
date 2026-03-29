/**
 * Composant Header
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightIcon?: string;
  onRightPress?: () => void;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  rightIcon,
  onRightPress,
  showBack = true,
}) => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.neutral.white} />
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={COLORS.neutral.darkGray}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.rightContainer}>
          {rightIcon && (
            <TouchableOpacity
              onPress={onRightPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={rightIcon as any}
                size={24}
                color={COLORS.neutral.darkGray}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral.borderGray,
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.title.fontSize,
    fontWeight: 'bold',
    color: COLORS.neutral.darkGray,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: COLORS.neutral.gray,
    marginTop: SPACING.xs,
  },
});

export default Header;
