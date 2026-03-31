/**
 * Composant carte pour une entrée du journal d'émotions.
 * Affiche : emoji + émotion + nuance + intensité + date + commentaire
 * + boutons Modifier / Supprimer
 */

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useMood } from '@/context/MoodContext';
import { MoodEntry } from '@/types/mood';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';

// ─── Visuels par émotion ───
const EMOTION_COLORS: Record<string, string> = {
    'Joie': '#FED95D', 'Tristesse': '#89C9EF', 'Colère': '#FF6B6B',
    'Peur': '#C29FE9', 'Dégoût': '#B8E083', 'Surprise': '#FCB1FC',
};
const EMOTION_EMOJIS: Record<string, string> = {
    'Joie': '😊', 'Tristesse': '😢', 'Colère': '😡',
    'Peur': '😨', 'Dégoût': '🤢', 'Surprise': '😮',
};

const getColor = (title?: string) => (title && EMOTION_COLORS[title]) || COLORS.neutral.gray;
const getEmoji = (title?: string) => (title && EMOTION_EMOJIS[title]) || '🫧';

const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
};

interface MoodEntryCardProps {
    entry: MoodEntry;
}

export default function MoodEntryCard({ entry }: MoodEntryCardProps) {
    const router = useRouter();
    const { deleteEntry } = useMood();

    const emotionTitle = entry.emotion?.title;
    const color = getColor(emotionTitle);
    const emoji = getEmoji(emotionTitle);

    const handleEdit = () => {
        router.push({
            pathname: '/emotions/new-entry',
            params: { editId: entry.idMoodEntry },
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Supprimer cette entrée ?',
            `Entrée du ${formatDate(entry.emotionDate)} — ${emotionTitle || 'émotion'}`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteEntry(entry.idMoodEntry);
                        } catch {
                            Alert.alert('Erreur', 'Impossible de supprimer cette entrée.');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <View style={[styles.colorBar, { backgroundColor: color }]} />
            {/* Ligne principale : emoji + infos + intensité */}
            <View style={styles.row}>
                <Text style={styles.emoji}>{emoji}</Text>
                <View style={styles.info}>
                    <Text style={styles.emotionTitle}>{emotionTitle || 'Émotion'}</Text>
                    {entry.feeling && (
                        <Text style={styles.feeling}>{entry.feeling.title}</Text>
                    )}
                </View>
                <Text style={styles.intensity}>{entry.parentEmotionIntensity}/10</Text>
            </View>

            {/* Date + actions rondes */}
            <View style={styles.dateActionsRow}>
                <Text style={styles.date}>{formatDate(entry.emotionDate)}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionBtnRound} onPress={handleEdit}>
                        <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtnRound, styles.actionBtnDelete]} onPress={handleDelete}>
                        <Text style={styles.actionIcon}>🗑</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Commentaire (si présent) */}
            {entry.comment && (
                <Text style={styles.comment} numberOfLines={2}>💬 {entry.comment}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.background,
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.md,
        paddingLeft: SPACING.md + 6,
        marginBottom: SPACING.sm,
        overflow: 'hidden',
    },
    colorBar: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 7,
        borderTopLeftRadius: DIMENSIONS.borderRadius.lg,
        borderBottomLeftRadius: DIMENSIONS.borderRadius.lg,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    emoji: { fontSize: 28, marginRight: SPACING.sm },
    info: { flex: 1 },
    emotionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    feeling: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    intensity: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    dateActionsRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginTop: SPACING.xs,
    },
    date: { fontSize: 12, color: COLORS.textLight },
    actions: {
        flexDirection: 'row', gap: SPACING.xs,
    },
    actionBtnRound: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    actionBtnDelete: {
        backgroundColor: '#FDECEA',
    },
    actionIcon: { fontSize: 14 },
    comment: {
        fontSize: 13, color: COLORS.textLight, marginTop: SPACING.sm, fontStyle: 'italic',
    },
});
                                    