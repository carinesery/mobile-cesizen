import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';

import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';
import { ButtonAction } from './ButtonAction';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { MoodEntry } from '@/types';
import { useRouter } from 'expo-router/build/exports';
import { useMood } from '@/context/MoodContext';

interface EmotionCardProps {
    entry: MoodEntry;
}

// export interface MoodEntry {
//     idMoodEntry: string;
//     emotionDate: string;           // Date au format ISO (normalisée UTC midnight)
//     parentEmotionIntensity: number; // 1-10
//     comment?: string;              // Max 500 chars (s'appelle "comment" dans le backend, pas "notes")
//     createdAt: string;
//     updatedAt?: string;
//     userId: string;
//     emotionId: string;
//     emotion?: Emotion;             // L'émotion principale (LEVEL_1)
//     feelingId?: string;
//     feeling?: Emotion;             // La nuance (LEVEL_2), optionnelle
// }
// { icon, emotion, feeling, intensity, date, handleEdit, handleDelete, comment }: { icon: any, emotion: string, feeling: string, intensity: string, date: string, handleEdit: () => void, handleDelete: () => void, comment: string }

export const EmotionCard = ({entry}: EmotionCardProps) => {

    const router = useRouter();
    const { deleteEntry } = useMood();

    // const emotionTitle = entry.emotion?.title;

    const handleEdit = () => {
        router.push({
            pathname: '/emotions/new-entry',
            params: { editId: entry.idMoodEntry },
        });
    };

    const formatDate = (isoDate: string) => {
        const d = new Date(isoDate);
        return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
    };

    return (
        <View style={styles.card}>
            <View style={styles.infosContainer}>
                <View style={styles.emotionsInfosContainer}>
                    <Image style={styles.emotionIcon} source={{ uri: entry.emotion?.iconUrl }} />
                    <View style={styles.emotionsContainer}>
                        <Text style={styles.titleCard}>{entry.emotion?.title}</Text>
                        <Text>{entry.feeling?.title}</Text>
                    </View>
                </View>
                <View style={styles.intensityDateContainer}>
                    <Text style={styles.titleCard}>{entry.parentEmotionIntensity}/10</Text>
                    <Text>{formatDate(entry.emotionDate)}</Text>
                </View>
            </View>
            <View style={styles.emotionsAction}>
                <ButtonAction bgColor={COLORS.accent} icon={<Ionicons name="pencil" size={16} color={COLORS.background} />} onPress={handleEdit} />
                <ButtonAction icon={<Ionicons name="trash" size={16} color={COLORS.background} />} onPress={() => deleteEntry(entry.idMoodEntry)} />
            </View>
            <View style={styles.commentContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.neutral.gray} />
                <Text>{entry.comment}</Text>
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
    emotionsContainer: {
        gap: SPACING.xs,
    },
    emotionsInfosContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    emotionIcon: {
        width: 40,
        height: 40,
        marginBottom: SPACING.xs,
    },
    intensityDateContainer: {
        alignItems: 'flex-end',
        gap: SPACING.xs,
    },
    emotionsAction: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: SPACING.sm,
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
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },

});