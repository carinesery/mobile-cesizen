import { ArticleCard } from '@/components/ArticleCard';
import { useArticles } from '@/context/ArticleContext';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Footer } from '@/components/Footer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';



const CONSEILS = [
    'Pratiquez la gratitude quotidiennement',
    'Faites des pauses régulières',
    'Limitez le temps d\'écran avant de dormir',
    'Parlez de vos émotions à un proche',
    'Essayez la méditation ou la respiration profonde',
];

const RESSOURCES = [
    { label: 'Ministère de la Santé', sub: 'Portail officiel', url: 'https://sante.gouv.fr' },
    { label: 'OMS', sub: 'Site officiel', url: 'https://www.who.int/fr' },
];

export default function HomeScreen() {

    const { loading, error, articles, translatedQuote, loadingQuote } = useArticles();
    const router = useRouter();

    if (loading) {
        return <LoadingScreen message="Chargement des articles..." />;
    }

    const lastestArticles = articles.slice(0, 3);

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

            {/* Citation du jour */}
            <ImageBackground
                source={{ uri: 'https://cdn.pixabay.com/photo/2016/11/21/03/56/landscape-1844226_1280.png' }}
                style={styles.quoteCard}
                imageStyle={{ borderRadius: 16 }}
                resizeMode="cover"
            >
                <View style={styles.quoteOverlay}>
                    {loadingQuote ? (
                        <Text style={styles.quoteText}>Chargement de la citation...</Text>
                    ) : translatedQuote ? (
                        <Text style={styles.quoteText}>{"\u00AB"} {translatedQuote} {"\u00BB"}</Text>
                    ) : null}
                </View>
            </ImageBackground>

            {/* Derniers articles */}
            {lastestArticles.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Derniers articles</Text>
                    {lastestArticles.map((item) => (
                        <TouchableOpacity
                            key={item.slug}
                            activeOpacity={0.7}
                            onPress={() => router.push(`/articles/${item.slug}`)}
                        >
                            <ArticleCard
                                title={item.title}
                                summary={item.summary}
                                creationDate={new Date(item.createdAt).toLocaleDateString()}
                                categories={item.categories?.map(cat => cat.title) || []}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Conseils pratiques */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Conseils pratiques</Text>
                </View>
                <View style={styles.tipsContainer}>
                    {CONSEILS.map((tip, index) => (
                        <View key={index} style={styles.tipRow}>
                            <View style={styles.tipBadge}>
                                <Text style={styles.tipBadgeText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Ressources externes */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="link-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.sectionTitle}>Ressources externes</Text>
                </View>
                {RESSOURCES.map((res, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.resourceRow}
                        activeOpacity={0.7}
                        onPress={() => Linking.openURL(res.url)}
                    >
                        <Ionicons name="open-outline" size={24} color={COLORS.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.resourceLabel}>{res.label}</Text>
                            <Text style={styles.resourceSub}>{res.sub}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bandeau urgence */}
            <LinearGradient
                colors={['#E50075', '#FF1F57']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.urgencyCard}
            >
                <Text style={styles.urgencyTitle}>Besoin d'aide immédiate ?</Text>
                <Text style={styles.urgencyText}>
                    Si vous traversez une période difficile, n'hésitez pas à contacter un professionnel.
                </Text>
                <TouchableOpacity
                    style={styles.urgencyButton}
                    onPress={() => Linking.openURL('tel:3114')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="call" size={18} color={COLORS.error} />
                    <Text style={styles.urgencyButtonText}>3114 - Prévention du suicide</Text>
                </TouchableOpacity>
                <Text style={styles.urgencyAvail}>Disponible 24h/24 et 7j/7</Text>
            </LinearGradient>

            {/* Footer */}
            <Footer height={0} marginTop={SPACING.lg} />
            <View style={{ height: SPACING.xl }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.md,
        gap: SPACING.lg,
    },

    /* Citation */
    quoteCard: {
        borderRadius: 16,
        minHeight: 180,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    quoteOverlay: {
        backgroundColor: 'rgba(58, 7, 92, 0.55)',
        borderRadius: 16,
        padding: SPACING.lg,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 180,
    },
    quoteText: {
        fontSize: 16,
        fontFamily: 'Nunito Sans',
        fontWeight: '700',
        color: COLORS.neutral.white,
        textAlign: 'center',
        lineHeight: 24,
    },

    /* Sections */
    section: {
        gap: SPACING.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    sectionTitle: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.text,
    },

    /* Conseils */
    tipsContainer: {
        backgroundColor: COLORS.searchInput,
        borderRadius: 16,
        padding: SPACING.md,
        gap: SPACING.md,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    tipBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Nunito Sans',
        fontWeight: '700',
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Nunito Sans',
        color: COLORS.text,
        lineHeight: 20,
    },

    /* Ressources */
    resourceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: SPACING.md,
        gap: SPACING.md,
    },
    resourceLabel: {
        fontSize: 15,
        fontFamily: 'Nunito Sans',
        fontWeight: '600',
        color: COLORS.text,
    },
    resourceSub: {
        fontSize: 13,
        fontFamily: 'Nunito Sans',
        color: COLORS.textLight,
    },

    /* Urgence */
    urgencyCard: {
        borderRadius: 16,
        padding: SPACING.lg,
        alignItems: 'center',
        gap: SPACING.sm,
    },
    urgencyTitle: {
        fontSize: 18,
        fontFamily: 'Nunito Sans',
        fontWeight: '700',
        color: '#fff',
    },
    urgencyText: {
        fontSize: 14,
        fontFamily: 'Nunito Sans',
        color: '#fff',
        textAlign: 'center',
        lineHeight: 20,
    },
    urgencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.xs,
    },
    urgencyButtonText: {
        fontSize: 15,
        fontFamily: 'Nunito Sans',
        fontWeight: '700',
        color: COLORS.error,
    },
    urgencyAvail: {
        fontSize: 12,
        fontFamily: 'Nunito Sans',
        color: 'rgba(255,255,255,0.85)',
    },
});
