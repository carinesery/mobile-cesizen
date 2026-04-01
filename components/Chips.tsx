import { View, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING } from '@/constants';



export const Chips = ({ category }: { category: string }) => {
    return (
        <View key={category} style={styles.categoryChips}>
            <Text>{category}</Text>
        </View>

    )
};

const styles = StyleSheet.create({
     categoryChips: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: SPACING.md,
        backgroundColor: COLORS.backgroundVisible,
        color: COLORS.accent,
        fontSize: 12,
        fontFamily: 'Inter',
        fontWeight: '800' as any,
        alignSelf: 'flex-start',
    },
});