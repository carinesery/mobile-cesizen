import { Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "expo-router";
import { useArticles } from "@/context/ArticleContext";
import { Article } from "../../../types/article";
import { SPACING, COLORS, TYPOGRAPHY } from "@/constants";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer } from "@/components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { LoadingScreen } from "@/components/LoadingScreen";


export default function ArticlesScreen() {

    const { articles: allArticles, loading, error } = useArticles();
    const articles = useMemo(() => allArticles.filter((article: Article) => article.status === 'PUBLISHED'), [allArticles]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<{ title: string, slug: string } | null>(null);
    const [ deboucedSearch, setDebouncedSearch ] = useState(search);

    const router = useRouter();

    const categories = useMemo(() => {
        return articles.reduce((acc: { title: string, slug: string }[], article) => {
            article.categories?.forEach((categorie) => {
                if (!acc.some(c => c.slug === categorie.slug)) {
                    acc.push({ title: categorie.title, slug: categorie.slug });
                }
            });
            return acc;
        }, []);
    }, [articles]);

    const filtered = useMemo(() => {
        let data = articles;
        if (deboucedSearch) {
            data = data.filter(article =>
                article.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (selectedCategory) {
            data = data.filter(article =>
                article.categories?.some(cat => cat.slug === selectedCategory.slug)
            );
        }
        return data;
    }, [articles, search, selectedCategory]);

    // Debounce de la recherche
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);


    if (loading) return <LoadingScreen message="Chargement des articles..." />;
    if (error) return <View style={{ backgroundColor: 'red' }}><Text>{error}</Text></View>;


    return (
        <>
            <View style={styles.screen}>

                {/* <Text style={{...TYPOGRAPHY.title}}>Consultez nos articles bien-être</Text> */}
                <View style={styles.container}>
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.slug}
                        contentContainerStyle={{ gap: SPACING.md, paddingBottom: SPACING.xl }}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <View style={{ gap: SPACING.md }}>
                                <View style={styles.searchContainer}>
                                    <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
                                    <TextInput
                                        placeholder="Rechercher un article ..."
                                        value={search}
                                        onChangeText={setSearch}
                                        style={styles.searchInput}
                                    />
                                </View>

                                <View style={styles.chipsWrap}>
                                    <TouchableOpacity
                                        onPress={() => setSelectedCategory(null)}
                                        style={[
                                            styles.chip,
                                            selectedCategory === null && styles.chipActive,
                                        ]}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            selectedCategory === null && styles.chipTextActive,
                                        ]}>
                                            Tous
                                        </Text>
                                    </TouchableOpacity>

                                    {categories.map((cat) => {
                                        const isActive = selectedCategory?.slug === cat.slug;
                                        return (
                                            <TouchableOpacity
                                                key={cat.slug}
                                                onPress={() => setSelectedCategory(cat)}
                                                style={[styles.chip, isActive && styles.chipActive]}
                                            >
                                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                                    {cat.title}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>


                                <Text style={styles.resultCount}>
                                    {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                                </Text>
                            </View>
                        }

                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                Aucun article trouvé
                            </Text>
                        }

                        renderItem={({ item }) => (
                            <TouchableOpacity
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
                        )}
                        ListFooterComponent={<Footer marginTop={16} />}
                    />
                </View>
            </View >
        </>
    );
}


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 20,
        paddingHorizontal: SPACING.md,
    },
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.searchInput,
        borderRadius: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.success,
        paddingHorizontal: 12,
        gap: SPACING.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: COLORS.text,
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    chip: {
        paddingVertical: SPACING.xs + 2,
        paddingHorizontal: SPACING.md,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.accent,
        
    },
    chipActive: {
        backgroundColor: COLORS.accent,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.accent,
    },
    chipTextActive: {
        color: '#fff',
    },
    resultCount: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        textAlign: 'right',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 15,
        color: COLORS.textLight,
    },
});
