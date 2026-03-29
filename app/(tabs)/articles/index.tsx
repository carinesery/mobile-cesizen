import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { articleService } from "../../../services/articleService";
import { Article } from "../../../types/article";
import { Header } from "@/components/Header";
import { SPACING, COLORS, TYPOGRAPHY } from "@/constants";


export default function ArticlesScreen() {

    const [articles, setArticles] = useState<Article[]>([]);
    // const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filtered, setFiltered] = useState<Article[]>([]);
    const [categories, setCategories] = useState<{ title: string, slug: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ title: string, slug: string } | null>(null);

    const router = useRouter();

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
           
            const data = await articleService.getAllArticles();

            const publishedArticles = data.filter((article: Article) => article.status === 'PUBLISHED');
            
            setArticles(publishedArticles);
        } catch (error: any) {
            
            const errorMessage = error.response?.data?.message || 'Erreur lors du chargement des articles';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const extractCategories = (articles: Article[]) => {
        const uniqueCategories = articles.reduce((acc: { title: string, slug: string }[], article) => {
            article.categories?.forEach((categorie) => {
                if (!acc.some(c => c.slug === categorie.slug)) {
                    acc.push({
                        title: categorie.title,
                        slug: categorie.slug
                    });
                }
            });
            return acc;
        }, []);

        setCategories(uniqueCategories);
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    useEffect(() => {
        if (articles.length > 0) {
            extractCategories(articles);
        }
    }, [articles]);

    useEffect(() => {
        let data = articles;

        // filtre recherche
        if (search) {
            data = data.filter(article =>
                article.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // filtre catégorie
        if (selectedCategory) {
            data = data.filter(article =>
                article.categories?.some(cat => cat.slug === selectedCategory.slug)
            );
        }

        setFiltered(data);
    }, [search, selectedCategory, articles]);


    if (loading) return <View><Text>Chargement...</Text></View>;
    if (error) return <View style={{ backgroundColor: 'red' }}><Text>{error}</Text></View>;


    return (

        <View style={{ flex: 1, padding: 20 }}>

            <Header title="Articles" />
            <View style={styles.container}>
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.slug}
                    ListHeaderComponent={
                        <>
                            <TextInput
                                placeholder="Rechercher un article ..."
                                value={search}
                                onChangeText={setSearch}
                                style={styles.searchInput}
                            />

                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity
                                    onPress={() => setSelectedCategory(null)}
                                    style={{ marginRight: 10 }}
                                >
                                    <Text style={{ color: selectedCategory === null ? "blue" : "black" }}>
                                        Tous
                                    </Text>
                                </TouchableOpacity>

                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.slug}
                                        onPress={() => setSelectedCategory(cat)}
                                        style={{ marginRight: 10 }}
                                    >
                                        <Text style={{ color: selectedCategory?.slug === cat.slug ? "blue" : "black" }}>
                                            {cat.title}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </>
                    }

                    ListEmptyComponent={
                        <Text style={{ textAlign: "center", marginTop: 20 }}>
                            Aucun article trouvé
                        </Text>
                    }

                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/articles/${item.slug}`)}
                        >
                            <View style={styles.articleCard}>

                                {item.presentationImageUrl ? (
                                    <Image source={{ uri: `http://192.168.1.85:3000${item.presentationImageUrl}` }} style={styles.image} />
                                ) : (
                                    <Image source={{ uri: `https://cdn.pixabay.com/photo/2016/02/17/19/08/lotus-1205631_1280.jpg` }} style={styles.image} />
                                )}

                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={TYPOGRAPHY.caption}>{item.summary}</Text>
                                    <Text style={styles.date}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderColor: COLORS.border,
        borderWidth: 1,
    },
    loading: {
        flex: 1,
        textAlign: "center",
        marginTop: 50,
        fontSize: 16,
    },
    error: {
        flex: 1,
        textAlign: "center",
        marginTop: 50,
        color: "red",
        fontSize: 16,
    },
    articleCard: {
        flexDirection: "row",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2, // pour shadow sur Android
    },
    image: {
        width: 100,
        height: 100,
    },
    textContainer: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: "#888",
    },
    separator: {
        height: 12,
    },
    searchInput: {
        backgroundColor: "#f2f2f2",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
});
