import { COLORS, SPACING } from '../constants/theme'
import { TouchableOpacity, StyleSheet } from 'react-native';


export const ButtonAction = ({ bgColor, icon, onPress }: { bgColor?: string; onPress: () => void; icon?: React.ReactNode }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: bgColor ?? COLORS.primary }]} onPress={onPress}>
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderRadius: SPACING.lg,
  },
});