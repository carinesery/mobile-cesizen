/**
 * Écran de création / modification d'une entrée d'émotion.
 * 
 * FLOW :
 * 1. Grille 3×2 : choisir une émotion principale (LEVEL_1)
 * 2. Slider : régler l'intensité de 1 à 10
 * 3. Chips : choisir une nuance optionnelle (LEVEL_2, enfants de l'émotion choisie)
 * 4. TextInput : commentaire optionnel (max 500 chars)
 * 5. Bouton Enregistrer
 * 
 * Si on reçoit un param `editId`, on pré-remplit le formulaire avec l'entrée existante.
 */

import { useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, ScrollView, ActivityIndicator, Alert,
    KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMood } from '@/context/MoodContext';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';


// ─── Couleurs et emojis par émotion ───
const EMOTION_VISUALS: Record<string, { color: string; emoji: string }> = {
    'Joie':      { color: '#FED95D', emoji: '😊' },
    'Tristesse': { color: '#89C9EF', emoji: '😢' },
    'Colère':    { color: '#FF6B6B', emoji: '😡' },
    'Peur':      { color: '#C29FE9', emoji: '😨' },
    'Dégoût':    { color: '#B8E083', emoji: '🤢' },
    'Surprise':  { color: '#FCB1FC', emoji: '😮' },
};

const getVisual = (title: string) =>
    EMOTION_VISUALS[title] || { color: COLORS.neutral.gray, emoji: '🫧' };

export default function NewEntryScreen() {
    const router = useRouter();
    const { editId, noDefaultDate } = useLocalSearchParams<{ editId?: string; noDefaultDate?: string }>();
    const {
        emotions, entries, isLoading, error,
        fetchEmotions, createEntry, updateEntry, clearError,
    } = useMood();

    // ─── État du formulaire ───
    // Si noDefaultDate='1' (entrée existe déjà aujourd'hui), date = null → l'utilisateur doit choisir
    // Sinon date = aujourd'hui par défaut
    const [emotionDate, setEmotionDate] = useState<Date | null>(noDefaultDate === '1' ? null : new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedEmotionId, setSelectedEmotionId] = useState<string | null>(null);
    const [intensity, setIntensity] = useState(5);
    const [selectedFeelingId, setSelectedFeelingId] = useState<string | null>(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // ─── Émotions principales (LEVEL_1) ───
    const primaryEmotions = useMemo(
        () => emotions.filter(e => e.level === 'LEVEL_1'),
        [emotions]
    );

    // ─── Nuances de l'émotion sélectionnée (LEVEL_2 enfants) ───
    const feelings = useMemo(() => {
        if (!selectedEmotionId) return [];
        // Chercher d'abord dans childEmotions si l'API les inclut
        const parent = emotions.find(e => e.idEmotion === selectedEmotionId);
        if (parent?.childEmotions && parent.childEmotions.length > 0) {
            return parent.childEmotions;
        }
        // Sinon filtrer manuellement
        return emotions.filter(e => e.level === 'LEVEL_2' && e.parentEmotionId === selectedEmotionId);
    }, [selectedEmotionId, emotions]);

    // ─── Charger les émotions + pré-remplir si édition ───
    useEffect(() => {
        fetchEmotions().catch(() => {});
    }, []);

    useEffect(() => {
        if (editId) {
            const entry = entries.find(e => e.idMoodEntry === editId);
            if (entry) {
                setEmotionDate(new Date(entry.emotionDate));
                setSelectedEmotionId(entry.emotionId);
                setIntensity(entry.parentEmotionIntensity);
                setSelectedFeelingId(entry.feelingId || null);
                setComment(entry.comment || '');
            }
        }
    }, [editId, entries]);

    // ─── Soumission ───
    const handleSubmit = async () => {
        if (!selectedEmotionId) {
            Alert.alert('Émotion requise', 'Sélectionnez une émotion avant d\'enregistrer.');
            return;
        }

        if (!emotionDate && !editId) {
            Alert.alert('Date requise', 'Sélectionnez une date pour cette entrée.');
            return;
        }

        try {
            setSubmitting(true);
            clearError();

            // On envoie la date au format ISO (YYYY-MM-DD)
            const dateStr = emotionDate ? emotionDate.toISOString().split('T')[0] : undefined;

            if (editId) {
                await updateEntry(editId, {
                    emotionId: selectedEmotionId,
                    emotionDate: dateStr,
                    parentEmotionIntensity: intensity,
                    feelingId: selectedFeelingId,
                    comment: comment.trim() || null,
                });
            } else {
                await createEntry({
                    emotionId: selectedEmotionId,
                    emotionDate: dateStr,
                    parentEmotionIntensity: intensity,
                    feelingId: selectedFeelingId || undefined,
                    comment: comment.trim() || undefined,
                });
            }

            router.back();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Une erreur est survenue';
            Alert.alert('Erreur', msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading && primaryEmotions.length === 0) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* ─── SECTION 0 : Date ─── */}
                <Text style={styles.sectionTitle}>📅 Quand ?</Text>
                <TouchableOpacity
                    style={[styles.dateButton, !emotionDate && styles.dateButtonEmpty]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={[styles.dateButtonText, !emotionDate && { color: COLORS.textLight }]}>
                        {emotionDate
                            ? emotionDate.toLocaleDateString('fr-FR', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })
                            : 'Sélectionnez une date'}
                    </Text>
                    <Text style={styles.dateButtonIcon}>✎</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <View style={styles.pickerContainer}>
                        <DateTimePicker
                            value={emotionDate || new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            maximumDate={new Date()}
                            minimumDate={new Date('2026-01-01')}
                            locale="fr-FR"
                            onChange={(_event: DateTimePickerEvent, date?: Date) => {
                                if (Platform.OS !== 'ios') setShowDatePicker(false);
                                if (date) setEmotionDate(date);
                            }}
                        />
                        {Platform.OS === 'ios' && (
                            <TouchableOpacity
                                style={styles.pickerDoneBtn}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.pickerDoneText}>Valider</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* ─── SECTION 1 : Choix de l'émotion ─── */}
                <Text style={styles.sectionTitle}>Comment je me sens ?</Text>
                <View style={styles.emotionGrid}>
                    {primaryEmotions.map((emotion) => {
                        const visual = getVisual(emotion.title);
                        const isSelected = selectedEmotionId === emotion.idEmotion;

                        return (
                            <TouchableOpacity
                                key={emotion.idEmotion}
                                style={[
                                    styles.emotionCard,
                                    { borderColor: visual.color },
                                    isSelected && { backgroundColor: visual.color + '20', borderWidth: 3 },
                                ]}
                                onPress={() => {
                                    setSelectedEmotionId(emotion.idEmotion);
                                    setSelectedFeelingId(null); // Reset la nuance quand on change d'émotion
                                }}
                            >
                                <Text style={styles.emotionEmoji}>{visual.emoji}</Text>
                                <Text style={[
                                    styles.emotionTitle,
                                    isSelected && { fontWeight: '800' },
                                ]}>
                                    {emotion.title}
                                </Text>
                                {isSelected && <Text style={styles.checkMark}>✓</Text>}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* ─── SECTION 2 : Intensité ─── */}
                {selectedEmotionId && (
                    <>
                        <Text style={styles.sectionTitle}>Intensité : {intensity}/10</Text>
                        <Text style={styles.sectionHint}>
                            1 = à peine ressenti · 10 = très intense
                        </Text>
                        <View style={styles.intensityRow}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                                const isActive = n <= intensity;
                                const emotionColor = getVisual(
                                    primaryEmotions.find(e => e.idEmotion === selectedEmotionId)?.title || ''
                                ).color;

                                return (
                                    <TouchableOpacity
                                        key={n}
                                        style={[
                                            styles.intensityDot,
                                            isActive && { backgroundColor: emotionColor, borderColor: emotionColor },
                                        ]}
                                        onPress={() => setIntensity(n)}
                                    >
                                        <Text style={[
                                            styles.intensityNumber,
                                            isActive && { color: '#fff' },
                                        ]}>
                                            {n}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* ─── SECTION 3 : Nuance / Feeling (optionnel) ─── */}
                {selectedEmotionId && feelings.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Une nuance ? (optionnel)</Text>
                        <View style={styles.feelingsRow}>
                            {feelings.map((feeling) => {
                                const isSelected = selectedFeelingId === feeling.idEmotion;
                                return (
                                    <TouchableOpacity
                                        key={feeling.idEmotion}
                                        style={[
                                            styles.feelingChip,
                                            isSelected && styles.feelingChipActive,
                                        ]}
                                        onPress={() =>
                                            setSelectedFeelingId(isSelected ? null : feeling.idEmotion)
                                        }
                                    >
                                        <Text style={[
                                            styles.feelingText,
                                            isSelected && styles.feelingTextActive,
                                        ]}>
                                            {feeling.title}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}

                {/* ─── SECTION 4 : Commentaire (optionnel) ─── */}
                {selectedEmotionId && (
                    <>
                        <Text style={styles.sectionTitle}>💬 Un mot ? (optionnel)</Text>
                        <TextInput
                            style={styles.commentInput}
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Comment je me sens en ce moment..."
                            placeholderTextColor={COLORS.neutral.gray}
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                        />
                        <Text style={styles.charCount}>{comment.length}/500</Text>
                    </>
                )}

                {/* ─── Bouton Enregistrer ─── */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        (!selectedEmotionId || submitting) && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!selectedEmotionId || submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>
                            {editId ? 'Modifier' : 'Enregistrer'}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Affichage erreur */}
                {error && <Text style={styles.errorText}>{error}</Text>}

                <View style={{ height: 40 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    container: { flex: 1, backgroundColor: COLORS.background },
    content: { padding: SPACING.md, paddingTop: SPACING.sm },

    // ─── Sections ───
    sectionTitle: {
        fontSize: 17, fontWeight: '700', color: COLORS.text,
        marginBottom: SPACING.sm, marginTop: SPACING.lg,
    },
    sectionHint: {
        fontSize: 13, color: COLORS.textLight, marginBottom: SPACING.sm,
    },

    // ─── Sélecteur de date ───
    dateButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.border,
        paddingVertical: 12, paddingHorizontal: SPACING.md,
        borderRadius: DIMENSIONS.borderRadius.lg,
    },
    dateButtonEmpty: {
        borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed',
        backgroundColor: '#FAFAFA',
    },
    dateButtonText: {
        fontSize: 15, color: COLORS.text, textTransform: 'capitalize', fontWeight: '600',
    },
    dateButtonIcon: {
        fontSize: 18, color: COLORS.primary,
    },
    pickerContainer: {
        backgroundColor: COLORS.background,
        borderRadius: DIMENSIONS.borderRadius.lg,
        marginTop: SPACING.sm,
        overflow: 'hidden',
    },
    pickerDoneBtn: {
        alignItems: 'center', paddingVertical: 10,
        borderTopWidth: 1, borderTopColor: COLORS.border,
    },
    pickerDoneText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },

    // ─── Grille émotions 3×2 ───
    emotionGrid: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    emotionCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: DIMENSIONS.borderRadius.lg,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
        position: 'relative',
    },
    emotionEmoji: { fontSize: 32, marginBottom: SPACING.xs },
    emotionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text },
    checkMark: {
        position: 'absolute', top: 6, right: 8,
        fontSize: 16, fontWeight: '800', color: COLORS.primary,
    },

    // ─── Intensité ───
    intensityRow: {
        flexDirection: 'row', justifyContent: 'space-between',
    },
    intensityDot: {
        width: 30, height: 30, borderRadius: 15,
        borderWidth: 2, borderColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    intensityNumber: { fontSize: 12, fontWeight: '700', color: COLORS.textLight },

    // ─── Nuances / Feelings ───
    feelingsRow: { flexDirection: 'row', flexWrap: 'wrap' },
    feelingChip: {
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: DIMENSIONS.borderRadius.full,
        borderWidth: 1, borderColor: COLORS.border,
        marginRight: SPACING.xs, marginBottom: SPACING.xs,
    },
    feelingChipActive: {
        backgroundColor: COLORS.primary, borderColor: COLORS.primary,
    },
    feelingText: { fontSize: 13, color: COLORS.text },
    feelingTextActive: { color: '#fff', fontWeight: '600' },

    // ─── Commentaire ───
    commentInput: {
        borderWidth: 1, borderColor: COLORS.border,
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.md,
        fontSize: 15, color: COLORS.text,
        minHeight: 100,
    },
    charCount: {
        fontSize: 12, color: COLORS.neutral.gray,
        textAlign: 'right', marginTop: 4,
    },

    // ─── Submit ───
    submitButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: DIMENSIONS.borderRadius.lg,
        alignItems: 'center',
        marginTop: SPACING.lg,
    },
    submitButtonDisabled: { opacity: 0.5 },
    submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },

    // ─── Erreur ───
    errorText: {
        color: COLORS.error, fontSize: 14,
        textAlign: 'center', marginTop: SPACING.md,
    },
});
