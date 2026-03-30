/**
 * Hub principal des émotions.
 * 
 * STRUCTURE :
 * 1. Écran inspirant si pas connecté (identique à avant)
 * 2. Si connecté :
 *    - CTA "Comment je me sens ?" (ou "Modifier" si déjà noté aujourd'hui)
 *    - Segmented control : Journal / Stats
 *    - Contenu conditionnel selon l'onglet actif
 */

import { useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, FlatList, ScrollView
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useMood } from '@/context/MoodContext';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';
import { MoodEntry } from '@/types/mood';
import { StatsData, StatsPeriod } from '@/types/stats';
import { statsService } from '@/services/statsService';

// ─── Couleurs par émotion (associées par titre, on pourra affiner) ───
const EMOTION_COLORS: Record<string, string> = {
    'Joie': '#FED95D',
    'Tristesse': '#89C9EF',
    'Colère': '#FF6B6B',
    'Peur': '#C29FE9',
    'Dégoût': '#B8E083',
    'Surprise': '#FCB1FC',
};

const getEmotionColor = (title?: string) =>
    (title && EMOTION_COLORS[title]) || COLORS.neutral.gray;

const getEmotionEmoji = (title?: string) => {
    const emojis: Record<string, string> = {
        'Joie': '😊', 'Tristesse': '😢', 'Colère': '😡',
        'Peur': '😨', 'Dégoût': '🤢', 'Surprise': '😮',
    };
    return (title && emojis[title]) || '🫧';
};

// ─── Formater une date ISO en "Lun. 30 mars" ───
const formatDate = (isoDate: string) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' });
};

const formatDateFull = () => {
    return new Date().toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
};

// ─── Vérifier si une date correspond à aujourd'hui ───
const isToday = (isoDate: string) => {
    const d = new Date(isoDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
};

export default function EmotionsHub() {
    const { user, initializing } = useAuth();
    const { entries, isLoading, fetchEntries, fetchEmotions } = useMood();
    const router = useRouter();

    // Onglet actif : journal ou stats
    const [activeTab, setActiveTab] = useState<'journal' | 'stats'>('journal');

    // Stats
    const [stats, setStats] = useState<StatsData | null>(null);
    const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('week');
    const [statsLoading, setStatsLoading] = useState(false);

    // Charger les données au montage (seulement si connecté)
    useEffect(() => {
        if (user) {
            fetchEntries().catch(() => {});
            fetchEmotions().catch(() => {});
        }
    }, [user]);

    // Charger les stats quand on switch sur l'onglet stats ou qu'on change de période
    useEffect(() => {
        if (user && activeTab === 'stats') {
            setStatsLoading(true);
            statsService.getStats(statsPeriod)
                .then(setStats)
                .catch(() => setStats(null))
                .finally(() => setStatsLoading(false));
        }
    }, [user, activeTab, statsPeriod]);

    // L'entrée d'aujourd'hui (si elle existe)
    const todayEntry = useMemo(
        () => entries.find(e => isToday(e.emotionDate)),
        [entries]
    );

    // Trier les entrées par date décroissante
    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) =>
            new Date(b.emotionDate).getTime() - new Date(a.emotionDate).getTime()
        ),
        [entries]
    );

    // ─── ÉCRAN CHARGEMENT ───
    if (initializing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // ─── PAS CONNECTÉ → écran inspirant ───
    if (!user) {
        return (
            <View style={styles.centered}>
                <Text style={styles.emoji}>🌊</Text>
                <Text style={styles.quote}>
                    « Les émotions sont des messagers.{'\n'}Les écouter, c'est le premier pas vers le changement. »
                </Text>
                <Text style={styles.inspirDescription}>
                    Pour observer et suivre vos émotions au quotidien, connectez-vous depuis la section Mon compte.
                </Text>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.navigate('/account')}
                >
                    <Text style={styles.primaryButtonText}>Aller à Mon compte</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ─── CONNECTÉ → HUB ───
    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.headerTitle}>Mes émotions</Text>
            <Text style={styles.dateText}>{formatDateFull()}</Text>

            {/* Segmented Control : Journal / Stats */}
            <View style={styles.segmentedControl}>
                <TouchableOpacity
                    style={[styles.segment, activeTab === 'journal' && styles.segmentActive]}
                    onPress={() => setActiveTab('journal')}
                >
                    <Text style={[styles.segmentText, activeTab === 'journal' && styles.segmentTextActive]}>
                        Journal
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.segment, activeTab === 'stats' && styles.segmentActive]}
                    onPress={() => setActiveTab('stats')}
                >
                    <Text style={[styles.segmentText, activeTab === 'stats' && styles.segmentTextActive]}>
                        Statistiques
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Contenu selon l'onglet actif */}
            {activeTab === 'journal' ? (
                <JournalTab entries={sortedEntries} isLoading={isLoading} />
            ) : (
                <StatsTab
                    stats={stats}
                    period={statsPeriod}
                    onPeriodChange={setStatsPeriod}
                    isLoading={statsLoading}
                />
            )}

            {/* FAB : bouton flottant en bas — toujours visible */}
            <TouchableOpacity
                style={[styles.fab, todayEntry && { backgroundColor: COLORS.accent }]}
                onPress={() => {
                    if (todayEntry) {
                        router.push({ pathname: '/emotions/new-entry', params: { editId: todayEntry.idMoodEntry } });
                    } else {
                        router.push('/emotions/new-entry');
                    }
                }}
            >
                <Text style={styles.fabText}>
                    {todayEntry ? '✏️' : '＋'}
                </Text>
            </TouchableOpacity>
            {/* Label sous le FAB */}
            <Text style={styles.fabLabel}>
                {todayEntry ? 'Modifier' : 'Comment je me sens ?'}
            </Text>
        </View>
    );
}

// ══════════════════════════════════════════════════════════
// COMPOSANT : Onglet Journal
// Une FlatList de cartes, chaque carte = une entrée d'émotion
// ══════════════════════════════════════════════════════════
function JournalTab({ entries, isLoading }: { entries: MoodEntry[]; isLoading: boolean }) {
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    }

    if (entries.length === 0) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>📝</Text>
                <Text style={styles.emptyText}>Aucune entrée pour le moment</Text>
                <Text style={styles.emptySubtext}>
                    Appuyez sur le bouton ci-dessus pour enregistrer votre première émotion
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={entries}
            keyExtractor={(item) => item.idMoodEntry}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
                const emotionTitle = item.emotion?.title;
                const color = getEmotionColor(emotionTitle);
                const emoji = getEmotionEmoji(emotionTitle);

                return (
                    <View style={[styles.entryCard, { borderLeftColor: color }]}>
                        <View style={styles.entryHeader}>
                            <Text style={styles.entryEmoji}>{emoji}</Text>
                            <View style={styles.entryInfo}>
                                <Text style={styles.entryEmotion}>{emotionTitle || 'Émotion'}</Text>
                                {item.feeling && (
                                    <Text style={styles.entryFeeling}>{item.feeling.title}</Text>
                                )}
                            </View>
                            <View style={styles.entryRight}>
                                <Text style={styles.entryIntensity}>{item.parentEmotionIntensity}/10</Text>
                                <Text style={styles.entryDate}>{formatDate(item.emotionDate)}</Text>
                            </View>
                        </View>
                        {item.comment && (
                            <Text style={styles.entryComment} numberOfLines={2}>
                                💬 {item.comment}
                            </Text>
                        )}
                    </View>
                );
            }}
        />
    );
}

// ══════════════════════════════════════════════════════════
// COMPOSANT : Onglet Statistiques
// Barres de répartition horizontales + émotion dominante
// ══════════════════════════════════════════════════════════
function StatsTab({
    stats, period, onPeriodChange, isLoading
}: {
    stats: StatsData | null;
    period: StatsPeriod;
    onPeriodChange: (p: StatsPeriod) => void;
    isLoading: boolean;
}) {
    const periods: { key: StatsPeriod; label: string }[] = [
        { key: 'week', label: 'Semaine' },
        { key: 'month', label: 'Mois' },
        { key: 'year', label: 'Année' },
    ];

    return (
        <ScrollView style={styles.statsContainer} showsVerticalScrollIndicator={false}>
            {/* Sélection de période */}
            <View style={styles.periodSelector}>
                {periods.map((p) => (
                    <TouchableOpacity
                        key={p.key}
                        style={[styles.periodButton, period === p.key && styles.periodButtonActive]}
                        onPress={() => onPeriodChange(p.key)}
                    >
                        <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 30 }} />
            ) : !stats || stats.totalEntries === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📊</Text>
                    <Text style={styles.emptyText}>Pas encore de données</Text>
                    <Text style={styles.emptySubtext}>
                        Commencez à enregistrer vos émotions pour voir vos statistiques
                    </Text>
                </View>
            ) : (
                <>
                    {/* Nombre total d'entrées */}
                    <Text style={styles.statsSummary}>
                        {stats.totalEntries} entrée{stats.totalEntries > 1 ? 's' : ''} sur cette période
                    </Text>

                    {/* Émotion dominante */}
                    {stats.mostFrequent && (
                        <View style={styles.dominantCard}>
                            <Text style={styles.dominantLabel}>Émotion dominante</Text>
                            <View style={styles.dominantRow}>
                                <Text style={styles.dominantEmoji}>
                                    {getEmotionEmoji(stats.mostFrequent.label)}
                                </Text>
                                <Text style={styles.dominantTitle}>{stats.mostFrequent.label}</Text>
                                <Text style={styles.dominantCount}>
                                    {stats.mostFrequent.count} fois · moy. {stats.mostFrequent.avgIntensity}/10
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Barres de répartition */}
                    <Text style={styles.sectionTitle}>Répartition</Text>
                    {stats.intensityByEmotion.map((emotionStat) => {
                        const pct = stats.totalEntries > 0
                            ? Math.round((emotionStat.count / stats.totalEntries) * 100)
                            : 0;
                        const color = getEmotionColor(emotionStat.label);

                        return (
                            <View key={emotionStat.emotionId} style={styles.barRow}>
                                <Text style={styles.barEmoji}>{getEmotionEmoji(emotionStat.label)}</Text>
                                <Text style={styles.barLabel}>{emotionStat.label}</Text>
                                <View style={styles.barTrack}>
                                    <View style={[styles.barFill, { width: `${Math.max(pct, 3)}%`, backgroundColor: color }]} />
                                </View>
                                <Text style={styles.barPct}>{pct}%</Text>
                            </View>
                        );
                    })}

                    {/* Évolution par jour (mini aperçu textuel) */}
                    {stats.evolutionByDay.length > 0 && (
                        <>
                            <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>Évolution</Text>
                            {stats.evolutionByDay.slice(-7).map((day) => (
                                <View key={day.date} style={styles.evolutionRow}>
                                    <Text style={styles.evolutionDate}>
                                        {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                                    </Text>
                                    <View style={styles.barTrack}>
                                        <View
                                            style={[
                                                styles.barFill,
                                                {
                                                    width: `${Math.max(day.avgIntensity * 10, 3)}%`,
                                                    backgroundColor: COLORS.primary,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.evolutionValue}>{day.avgIntensity}/10</Text>
                                </View>
                            ))}
                        </>
                    )}
                </>
            )}
            <View style={{ height: 30 }} />
        </ScrollView>
    );
}

// ══════════════════════════════════════════════════════════
// STYLES
// ══════════════════════════════════════════════════════════
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 60,
        paddingHorizontal: SPACING.md,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: COLORS.background,
    },

    // ─── Écran inspirant (non connecté) ───
    emoji: { fontSize: 60, marginBottom: 25 },
    quote: {
        fontSize: 18, fontStyle: 'italic', color: '#444',
        textAlign: 'center', lineHeight: 28, marginBottom: 30, paddingHorizontal: 10,
    },
    inspirDescription: {
        fontSize: 15, color: COLORS.textLight,
        textAlign: 'center', lineHeight: 22, marginBottom: 30,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14, paddingHorizontal: 30, borderRadius: DIMENSIONS.borderRadius.lg,
    },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

    // ─── Hub connecté ───
    headerTitle: {
        fontSize: 26, fontWeight: '800', color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    dateText: {
        fontSize: 14, color: COLORS.textLight,
        textTransform: 'capitalize', marginBottom: SPACING.md,
    },

    // ─── FAB (bouton flottant en bas) ───
    fab: {
        position: 'absolute',
        bottom: 28,
        alignSelf: 'center',
        width: 60, height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 6, elevation: 8,
    },
    fabText: { fontSize: 26, color: '#fff' },
    fabLabel: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        fontSize: 11, color: COLORS.textLight, fontWeight: '600',
    },

    // ─── Segmented Control ───
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: COLORS.border,
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: 3,
        marginBottom: SPACING.md,
    },
    segment: {
        flex: 1, paddingVertical: 10,
        borderRadius: DIMENSIONS.borderRadius.md,
        alignItems: 'center',
    },
    segmentActive: {
        backgroundColor: COLORS.background,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1, shadowRadius: 2, elevation: 2,
    },
    segmentText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
    segmentTextActive: { color: COLORS.primary },

    // ─── Journal ───
    entryCard: {
        backgroundColor: COLORS.background,
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.neutral.gray,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
    },
    entryHeader: { flexDirection: 'row', alignItems: 'center' },
    entryEmoji: { fontSize: 28, marginRight: SPACING.sm },
    entryInfo: { flex: 1 },
    entryEmotion: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    entryFeeling: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
    entryRight: { alignItems: 'flex-end' },
    entryIntensity: { fontSize: 16, fontWeight: '700', color: COLORS.text },
    entryDate: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
    entryComment: {
        fontSize: 13, color: COLORS.textLight, marginTop: SPACING.sm,
        fontStyle: 'italic',
    },

    // ─── Empty state ───
    emptyState: { alignItems: 'center', marginTop: 40 },
    emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
    emptyText: { fontSize: 17, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
    emptySubtext: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', paddingHorizontal: 20 },

    // ─── Stats ───
    statsContainer: { flex: 1 },
    periodSelector: {
        flexDirection: 'row', marginBottom: SPACING.lg,
    },
    periodButton: {
        flex: 1, paddingVertical: 8,
        borderRadius: DIMENSIONS.borderRadius.md,
        borderWidth: 1, borderColor: COLORS.border,
        alignItems: 'center', marginHorizontal: 3,
    },
    periodButtonActive: {
        backgroundColor: COLORS.primary, borderColor: COLORS.primary,
    },
    periodText: { fontSize: 13, fontWeight: '600', color: COLORS.textLight },
    periodTextActive: { color: '#fff' },

    statsSummary: {
        fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.md, textAlign: 'center',
    },
    dominantCard: {
        backgroundColor: '#F9F5FF',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        alignItems: 'center',
    },
    dominantLabel: { fontSize: 13, color: COLORS.textLight, marginBottom: SPACING.xs },
    dominantRow: { flexDirection: 'row', alignItems: 'center' },
    dominantEmoji: { fontSize: 28, marginRight: SPACING.sm },
    dominantTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginRight: SPACING.sm },
    dominantCount: { fontSize: 13, color: COLORS.textLight },

    sectionTitle: {
        fontSize: 15, fontWeight: '700', color: COLORS.text,
        marginBottom: SPACING.sm, marginTop: SPACING.xs,
    },
    barRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm,
    },
    barEmoji: { fontSize: 20, width: 30 },
    barLabel: { fontSize: 13, color: COLORS.text, width: 70 },
    barTrack: {
        flex: 1, height: 12,
        backgroundColor: COLORS.border, borderRadius: 6,
        marginHorizontal: SPACING.xs, overflow: 'hidden',
    },
    barFill: { height: '100%', borderRadius: 6 },
    barPct: { fontSize: 13, color: COLORS.textLight, width: 35, textAlign: 'right' },

    // ─── Évolution ───
    evolutionRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs,
    },
    evolutionDate: { fontSize: 12, color: COLORS.textLight, width: 60 },
    evolutionValue: { fontSize: 12, color: COLORS.textLight, width: 40, textAlign: 'right' },
});
