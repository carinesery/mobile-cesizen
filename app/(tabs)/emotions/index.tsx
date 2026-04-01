import { useEffect, useState, useMemo } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, ScrollView, Platform, Dimensions,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PieChart, LineChart } from 'react-native-gifted-charts';
import { useAuth } from '@/context/AuthContext';
import { useMood } from '@/context/MoodContext';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';
import { LoadingScreen } from '@/components/LoadingScreen';
import { MoodEntry } from '@/types/mood';
import { StatsData, StatsPeriod } from '@/types/stats';
import { statsService } from '@/services/statsService';
import MoodEntryCard from '@/components/MoodEntry';

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

// ─── Vérifier si une date correspond à aujourd'hui ───
const isToday = (isoDate: string) => {
    const d = new Date(isoDate);
    const now = new Date();
    return d.toDateString() === now.toDateString();
};

export default function EmotionsHub() {
    const { user, initializing } = useAuth();
    const { entries, emotions, isLoading, fetchEntries, fetchEmotions } = useMood();
    const router = useRouter();

    // Onglet actif : journal ou stats
    const [activeTab, setActiveTab] = useState<'journal' | 'stats'>('journal');

    // Stats
    const [stats, setStats] = useState<StatsData | null>(null);
    const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('week');
    const [statsLoading, setStatsLoading] = useState(false);

    // Charger les données au montage (seulement si connecté)
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    await fetchEntries();
                    await fetchEmotions();
                } catch {
                    // Handle errors if needed
                }
            }
        };
        fetchData();
    }, [user]);

    // Charger les stats quand on switch sur l'onglet stats ou qu'on change de période
    useEffect(() => {
        const fetchStats = async () => {
            if (user && activeTab === 'stats') {
                setStatsLoading(true);
                try {
                    const data = await statsService.getStats(statsPeriod);
                    setStats(data);
                } catch {
                    setStats(null);
                } finally {
                    setStatsLoading(false);
                }
            }
        };
        fetchStats();
    }, [user, activeTab, statsPeriod]);

    // L'entrée d'aujourd'hui (si elle existe)
    const todayEntry = useMemo(
        () => entries.find(e => isToday(e.emotionDate)),
        [entries]
    );

    // ─── ÉCRAN CHARGEMENT ───
    if (initializing) {
        return <LoadingScreen />;
    }

    // Si pas connecté, écran avec message inspirant 
    if (!user) {
        return (
            <View style={styles.centeredGuest}>
                <Image
                    source={require('../../../assets/lotus.png')}
                    style={styles.lotusIcon}
                    contentFit='contain'
                />
                <Text style={styles.guestTitle}>Mes émotions</Text>
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

    // Si connecté, Moodentries et Stats
    return (
        <View style={styles.container}>
            {/* Header */}
            {/* <Text style={styles.headerTitle}>Mes émotions</Text> */}
            {/* <Text style={styles.dateText}>{formatDateFull()}</Text> */}

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
                <JournalTab entries={entries} emotions={emotions} isLoading={isLoading} />
            ) : (
                <StatsTab
                    stats={stats}
                    period={statsPeriod}
                    onPeriodChange={setStatsPeriod}
                    isLoading={statsLoading}
                />
            )}

            {/* FAB : bouton flottant en bas — toujours visible, toujours + */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    // S'il y a déjà une entrée aujourd'hui → pas de date par défaut
                    // Sinon → date d'aujourd'hui par défaut
                    if (todayEntry) {
                        router.push({ pathname: '/emotions/new-entry', params: { noDefaultDate: '1' } });
                    } else {
                        router.push('/emotions/new-entry');
                    }
                }}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
            {/* Label sous le FAB */}
            {/* <Text style={styles.fabLabel}>
                {todayEntry ? 'Modifier' : 'Comment je me sens ?'}
            </Text> */}
        </View>
    );
}

// ══════════════════════════════════════════════════════════
// COMPOSANT : Onglet Journal
// Une FlatList de cartes, chaque carte = une entrée d'émotion
// ══════════════════════════════════════════════════════════
// ── Helpers pour classer les entrées par section ──
const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

const getSectionKey = (isoDate: string): string => {
    const entryDate = new Date(isoDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const entryDay = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());

    if (entryDay.getTime() === today.getTime()) return 'Aujourd\'hui';

    const monday = getMonday(now);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    if (entryDay >= monday && entryDay <= sunday) return 'Cette semaine';

    if (entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()) {
        return 'Ce mois-ci';
    }

    return 'Avant';
};

const SECTION_ORDER = ['Aujourd\'hui', 'Cette semaine', 'Ce mois-ci', 'Avant'];

// ══════════════════════════════════════════════════════════
// COMPOSANT : Onglet Journal — SectionList avec filtres
// ══════════════════════════════════════════════════════════

import { Emotion } from '@/types/mood';

function JournalTab({
    entries, emotions, isLoading
}: {
    entries: MoodEntry[];
    emotions: Emotion[];
    isLoading: boolean;
}) {
    const router = useRouter();
    // Filtre par date
    const [searchDate, setSearchDate] = useState<Date | null>(null);
    const [showSearchPicker, setShowSearchPicker] = useState(false);
    // Date temporaire pendant la sélection (iOS spinner reste ouvert)
    const [tempDate, setTempDate] = useState<Date>(new Date());

    // Filtre par émotion
    const [filterEmotionId, setFilterEmotionId] = useState<string | null>(null);

    // Émotions principales pour les chips
    const primaryEmotions = useMemo(
        () => emotions.filter(e => e.level === 'LEVEL_1'),
        [emotions]
    );

    // Filtrer et trier les entrées
    const filteredEntries = useMemo(() => {
        let result = [...entries];

        // Filtre par date exacte
        if (searchDate) {
            const target = searchDate.toDateString();
            result = result.filter(e => new Date(e.emotionDate).toDateString() === target);
        }

        // Filtre par émotion
        if (filterEmotionId) {
            result = result.filter(e => e.emotionId === filterEmotionId);
        }

        // Tri par date décroissante
        result.sort((a, b) => new Date(b.emotionDate).getTime() - new Date(a.emotionDate).getTime());
        return result;
    }, [entries, searchDate, filterEmotionId]);

    // Entrées d'aujourd'hui (toujours visibles, séparées de la SectionList)
    const todayEntries = useMemo(() => {
        if (searchDate) return null; // pas de bloc "Aujourd'hui" en mode recherche date
        let result = filteredEntries.filter(e => isToday(e.emotionDate));
        return result;
    }, [filteredEntries, searchDate]);

    // Construire les sections (SANS "Aujourd'hui")
    const sections = useMemo(() => {
        if (searchDate) {
            return [{ title: formatDate(searchDate.toISOString()), data: filteredEntries }];
        }

        const grouped: Record<string, MoodEntry[]> = {};
        for (const entry of filteredEntries) {
            const key = getSectionKey(entry.emotionDate);
            if (key === 'Aujourd\'hui') continue; // géré séparément
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(entry);
        }

        return SECTION_ORDER
            .filter(key => key !== 'Aujourd\'hui' && grouped[key] && grouped[key].length > 0)
            .map(key => ({ title: key, data: grouped[key] || [] }));
    }, [filteredEntries, searchDate]);

    const clearFilters = () => {
        setSearchDate(null);
        setFilterEmotionId(null);
        setShowSearchPicker(false);
    };

    const hasFilters = searchDate !== null || filterEmotionId !== null;

    return (
        <View style={{ flex: 1 }}>
            {/* ─── Recherche par date ─── */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.dateSearchBtn, searchDate && styles.dateSearchBtnActive]}
                    onPress={() => {
                        setTempDate(searchDate || new Date());
                        setShowSearchPicker(true);
                    }}
                >
                    <Text style={[styles.dateSearchText, searchDate && styles.dateSearchTextActive]}>
                        {searchDate
                            ? `📅 ${searchDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`
                            : '📅 Rechercher une date'}
                    </Text>
                </TouchableOpacity>
                {hasFilters && !showSearchPicker && (
                    <TouchableOpacity style={styles.resetPickerBtn} onPress={clearFilters}>
                        <Text style={styles.resetPickerText}>Réinitialiser</Text>
                    </TouchableOpacity>
                )}
            </View>
            {showSearchPicker && (
                <View>
                    <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        maximumDate={new Date()}
                        minimumDate={new Date('2026-01-01')}
                        locale="fr-FR"
                        onChange={(_event: DateTimePickerEvent, date?: Date) => {
                            if (Platform.OS === 'ios') {
                                if (date) setTempDate(new Date(date.getTime()));
                            } else {
                                setShowSearchPicker(false);
                                if (date) setSearchDate(new Date(date.getTime()));
                            }
                        }}
                    />
                    {Platform.OS === 'ios' && (
                        <View style={styles.pickerActions}>
                            <TouchableOpacity
                                style={styles.resetPickerBtn}
                                onPress={clearFilters}
                            >
                                <Text style={styles.resetPickerText}>Réinitialiser</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.validatePickerBtn}
                                onPress={() => {
                                    setSearchDate(new Date(tempDate.getTime()));
                                    setShowSearchPicker(false);
                                }}
                            >
                                <Text style={styles.validatePickerText}>Valider</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* ─── Chips filtre par émotion ─── */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.chipsRow}
                contentContainerStyle={styles.chipsContent}
            >
                {primaryEmotions.map((emotion) => {
                    const isActive = filterEmotionId === emotion.idEmotion;
                    return (
                        <TouchableOpacity
                            key={emotion.idEmotion}
                            style={[styles.chip, isActive && styles.chipActive]}
                            onPress={() => setFilterEmotionId(isActive ? null : emotion.idEmotion)}
                        >
                            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                {emotion.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* ─── Liste ou chargement ─── */}
            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
            ) : !searchDate && sections.length === 0 && todayEntries?.length === 0 && !hasFilters ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>📝</Text>
                    <Text style={styles.emptyText}>Aucune entrée pour le moment</Text>
                    <Text style={styles.emptySubtext}>
                        Appuyez sur + pour enregistrer votre première émotion
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 90 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Bloc Aujourd'hui */}
                    {todayEntries !== null && (
                        <View style={styles.todaySection}>
                            <Text style={styles.sectionHeaderToday}>Aujourd'hui</Text>
                            {todayEntries.length > 0 ? (
                                todayEntries.map(item => (
                                    <MoodEntryCard key={item.idMoodEntry} entry={item} />
                                ))
                            ) : (
                                <TouchableOpacity
                                    style={styles.todayPlaceholder}
                                    onPress={() => router.push('/emotions/new-entry')}
                                >
                                    <Text style={styles.todayPlaceholderEmoji}>🌤️</Text>
                                    <Text style={styles.todayPlaceholderText}>
                                        Comment vous sentez-vous aujourd'hui ?
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Autres sections */}
                    {sections.map(section => (
                        <View key={section.title} style={styles.sectionContainer}>
                            <Text style={styles.sectionHeader}>{section.title}</Text>
                            {section.data.length > 0 ? (
                                section.data.map(item => (
                                    <MoodEntryCard key={item.idMoodEntry} entry={item} />
                                ))
                            ) : searchDate ? (
                                <View style={styles.noResultSection}>
                                    <Text style={styles.noResultText}>Aucune entrée à cette date</Text>
                                </View>
                            ) : null}
                        </View>
                    ))}

                    {/* Aucun résultat (filtres actifs, rien nulle part) */}
                    {hasFilters && sections.length === 0 && todayEntries !== null && todayEntries.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Aucun résultat</Text>
                            <Text style={styles.emptySubtext}>Essayez de modifier vos filtres</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

// ══════════════════════════════════════════════════════════
// COMPOSANT : Onglet Statistiques
// Camembert répartition · Courbe intensité · Fréquences
// ══════════════════════════════════════════════════════════
const screenWidth = Dimensions.get('window').width;

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

    /* ── Données pour le camembert ── */
    const pieData = useMemo(() => {
        if (!stats) return [];
        const total = stats.totalEntries;
        return stats.intensityByEmotion.map((e) => {
            const pct = total > 0 ? Math.round((e.count / total) * 100) : 0;
            return {
                value: e.count,
                color: getEmotionColor(e.label),
                text: `${pct}%`,
                label: e.label,
            };
        });
    }, [stats]);

    /* ── Données pour la courbe d'intensité ── */
    const lineData = useMemo(() => {
        if (!stats || stats.evolutionByDay.length === 0) return null;
        const last7 = stats.evolutionByDay.slice(-7);
        return last7.map((d) => ({
            value: d.avgIntensity,
            label: new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' }).slice(0, 3),
        }));
    }, [stats]);

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

                    {/* ── Camembert (répartition) ── */}
                    <View style={styles.chartCard}>
                        <Text style={styles.chartTitle}>Répartition des émotions</Text>
                        <PieChart
                            data={pieData}
                            radius={90}
                        />
                        {/* Légende */}
                        <View style={styles.legendContainer}>
                            {pieData.map((item: any) => (
                                <View key={item.label} style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                    <Text style={styles.legendText}>{item.label} {item.text}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── Courbe d'intensité ── */}
                    {lineData && (
                        <View style={styles.chartCard}>
                            <Text style={styles.chartTitle}>Évolution de l'intensité</Text>
                            <LineChart
                                data={lineData}
                                width={screenWidth - SPACING.md * 6}
                                height={180}
                                curved
                                color={COLORS.primary}
                                thickness={2}
                                dataPointsColor={COLORS.primary}
                                dataPointsRadius={5}
                                yAxisColor="transparent"
                                xAxisColor={COLORS.border}
                                yAxisTextStyle={{ color: COLORS.textLight, fontSize: 11 }}
                                xAxisLabelTextStyle={{ color: COLORS.textLight, fontSize: 11 }}
                                noOfSections={5}
                                maxValue={10}
                                isAnimated
                            />
                        </View>
                    )}

                    {/* ── Émotion la + / la − fréquente ── */}
                    <Text style={styles.chartTitle}>Fréquence des émotions</Text>
                    <View style={styles.frequentRow}>
                        {stats.mostFrequent && (
                            <View style={[styles.frequentCard]}>
                                <View style={[styles.colorBar, { backgroundColor: getEmotionColor(stats.mostFrequent.label) }]} />
                                <Text style={styles.frequentLabel}>La + fréquente</Text>
                                <Text style={styles.frequentEmoji}>{getEmotionEmoji(stats.mostFrequent.label)}</Text>
                                <Text style={styles.frequentTitle}>{stats.mostFrequent.label}</Text>
                                <Text style={styles.frequentDetail}>
                                    {stats.mostFrequent.count} fois · moy. {stats.mostFrequent.avgIntensity}/10
                                </Text>
                            </View>
                        )}
                        {stats.leastFrequent && (
                            <View style={[styles.frequentCard]}>
                                <View style={[styles.colorBar, { backgroundColor: getEmotionColor(stats.leastFrequent.label) }]} />
                                <Text style={styles.frequentLabel}>La − fréquente</Text>
                                <Text style={styles.frequentEmoji}>{getEmotionEmoji(stats.leastFrequent.label)}</Text>
                                <Text style={styles.frequentTitle}>{stats.leastFrequent.label}</Text>
                                <Text style={styles.frequentDetail}>
                                    {stats.leastFrequent.count} fois · moy. {stats.leastFrequent.avgIntensity}/10
                                </Text>
                            </View>
                        )}
                    </View>
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
        paddingTop: 10,
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
    centeredGuest: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#F3E8FF',
    },
    lotusIcon: {
        width: 80,
        height: 80,
        marginBottom: SPACING.lg,
    },
    guestTitle: {
        fontSize: 22, fontWeight: '700', color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    quote: {
        fontSize: 16, fontStyle: 'italic', color: COLORS.textLight,
        textAlign: 'center', lineHeight: 26, marginBottom: SPACING.lg, paddingHorizontal: 10,
    },
    inspirDescription: {
        fontSize: 15, color: COLORS.textLight,
        textAlign: 'center', lineHeight: 22, marginBottom: SPACING.lg,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14, paddingHorizontal: 40, borderRadius: DIMENSIONS.borderRadius.lg,
        width: '80%', alignItems: 'center',
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
        right: 28,
        width: 60, height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25, shadowRadius: 6, elevation: 8,
    },
    fabText: {
        fontSize: 26,
        color: '#fff'
    },
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

    // ─── Journal : filtres + sections ───
    filterRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm,
    },
    dateSearchBtn: {
        flex: 1,
        backgroundColor: COLORS.border,
        paddingVertical: 10, paddingHorizontal: SPACING.md,
        borderRadius: DIMENSIONS.borderRadius.lg,
    },
    dateSearchBtnActive: {
        backgroundColor: '#E8F5E9',
        borderWidth: 1, borderColor: COLORS.accent,
    },
    dateSearchText: { fontSize: 14, color: COLORS.textLight },
    dateSearchTextActive: { color: COLORS.accent, fontWeight: '600' },


    chipsRow: { flexShrink: 0 },
    chipsContent: { paddingRight: SPACING.md },
    chip: {
        height: 34,
        paddingHorizontal: 16,
        borderRadius: DIMENSIONS.borderRadius.full,
        backgroundColor: '#CCF0E8',
        marginRight: SPACING.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chipActive: {
        backgroundColor: COLORS.primary,
    },
    chipText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
    chipTextActive: { color: '#fff' },

    sectionHeader: {
        fontSize: 14, fontWeight: '700', color: COLORS.textLight,
        textTransform: 'uppercase', letterSpacing: 0.5,
        marginBottom: SPACING.xs,
    },
    sectionHeaderToday: {
        fontSize: 14, fontWeight: '700', color: COLORS.text,
        textTransform: 'uppercase', letterSpacing: 0.5,
        marginBottom: SPACING.xs,
    },
    todaySection: {
        backgroundColor: '#F1FDFB',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    sectionContainer: {
        backgroundColor: COLORS.background,
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.sm,
        marginBottom: SPACING.xs,
    },

    // ─── Placeholder "Aujourd'hui" (pas d'entrée) ───
    todayPlaceholder: {
        backgroundColor: '#F9F5FF',
        borderRadius: DIMENSIONS.borderRadius.lg,
        borderWidth: 1, borderColor: COLORS.secondary,
        borderStyle: 'dashed',
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        flexDirection: 'row', alignItems: 'center',
    },
    todayPlaceholderEmoji: { fontSize: 28, marginRight: SPACING.sm },
    todayPlaceholderText: {
        flex: 1, fontSize: 15, color: COLORS.primary, fontWeight: '600',
    },
    pickerActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    resetPickerBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: DIMENSIONS.borderRadius.md,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    resetPickerText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: '600',
    },
    validatePickerBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: DIMENSIONS.borderRadius.md,
    },
    validatePickerText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    noResultSection: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    noResultText: {
        fontSize: 15,
        color: COLORS.textLight,
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
    chartCard: {
        backgroundColor: '#fff',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.sm,
        marginBottom: SPACING.lg,
        alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
    },
    chartTitle: {
        fontSize: 15, fontWeight: '700', color: COLORS.text,
        marginBottom: SPACING.md, alignSelf: 'flex-start',
    },
    legendContainer: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'center', gap: SPACING.xs,
        marginTop: SPACING.sm,
    },
    legendItem: {
        flexDirection: 'row', alignItems: 'center', marginRight: SPACING.sm,
    },
    legendDot: {
        width: 10, height: 10, borderRadius: 5, marginRight: 5,
    },
    legendText: {
        fontSize: 12, color: COLORS.textLight,
    },
    frequentRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.xs,
    },
    frequentCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.md,
        paddingLeft: SPACING.md + 6,
        alignItems: 'center',
        overflow: 'hidden',
    },
    colorBar: {
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 7,
        borderTopLeftRadius: DIMENSIONS.borderRadius.lg,
        borderBottomLeftRadius: DIMENSIONS.borderRadius.lg,
    },
    frequentLabel: { fontSize: 11, color: COLORS.textLight, marginBottom: SPACING.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
    frequentEmoji: { fontSize: 28, marginBottom: SPACING.xs },
    frequentTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
    frequentDetail: { fontSize: 11, color: COLORS.textLight, textAlign: 'center' },
});
