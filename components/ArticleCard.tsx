import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { Chips } from './Chips';



export const ArticleCard = ({ title, summary, creationDate, categories }: { title: string, summary: string | undefined, creationDate: string, categories: string[] | null }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.titleCard}>{title}</Text>
            <Text>{summary}</Text>
            <View style={styles.infosContainer}>
                <View style={styles.authorContainer}>
                    <Ionicons name="person-outline" size={16} style={{ paddingHorizontal: SPACING.xs }} color={COLORS.neutral.gray} />
                    <Text style={styles.infos}>Ministère de la santé</Text>
                </View>
                <Text style={styles.infos}>{creationDate}</Text>
            </View>
            <View style={styles.categoriesContainer}>
                {categories?.map((category) => (
                    <Chips key={category} category={category} />
                ))}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: SPACING.md,
        backgroundColor: COLORS.background,
        gap: SPACING.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderDiscret,
    },
    titleCard: {
        ...TYPOGRAPHY.title,
        color: COLORS.text,
    },
    categoriesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
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
    infosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    infos: {
        fontSize: 12,
        fontFamily: 'Inter',
        color: COLORS.neutral.gray,
    }
});