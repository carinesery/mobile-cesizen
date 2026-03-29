import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { articleService } from "../../../services/articleService";
import { Article } from "../../../types/article";
import { useLocalSearchParams, Stack } from "expo-router";

export default function ArticleDetail() {

    const { slug } = useLocalSearchParams() as { slug: string };

    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);
           
            const data = await articleService.getArticleBySlug(slug);
          
            setCurrentArticle(data);
        } catch (error: any) {
           
            const errorMessage = error.response?.data?.message || 'Erreur lors du chargement de l\'article';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchArticle();
    }, [slug]);

    if (!currentArticle) return <Text>Chargement...</Text>;

    return (
        <>
            <Stack.Screen
                options={{
                    title: currentArticle?.title || "Article"
                }}
            />
            <ScrollView style={styles.container}>
                {/* IMAGE */}
                {currentArticle?.presentationImageUrl ? (
                    <Image
                        source={{ uri: `http://192.168.1.85:3000${currentArticle.presentationImageUrl}` }}
                        style={styles.image}
                    />
                ) : (
                    <Image
                        source={{ uri: "https://cdn.pixabay.com/photo/2016/02/17/19/08/lotus-1205631_1280.jpg" }}
                        style={styles.image}
                    />
                )}

                <View style={styles.content}>
                    {/* CATEGORIES */}
                    <View style={styles.categoriesContainer}>
                        {currentArticle?.categories?.map((cat) => (
                            <View key={cat.slug} style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{cat.title}</Text>
                            </View>
                        ))}
                    </View>

                    {/* TITLE */}
                    <Text style={styles.title}>{currentArticle?.title}</Text>

                    {/* DATE */}
                    <Text style={styles.date}>
                        {new Date(currentArticle?.createdAt || '').toLocaleDateString()}
                    </Text>

                    {/* SUMMARY */}
                    {currentArticle?.summary && (
                        <Text style={styles.summary}>{currentArticle.summary}</Text>
                    )}

                    {/* CONTENT */}
                    {currentArticle?.content && (
                        <Text style={styles.contentText}>{currentArticle.content}</Text>
                    )}
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    image: {
        width: "100%",
        height: 220,
    },
    content: {
        padding: 16,
    },
    categoriesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    categoryChip: {
        backgroundColor: "#eee",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 12,
        color: "#555",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 8,
    },
    date: {
        fontSize: 12,
        color: "#888",
        marginBottom: 16,
    },
    summary: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 16,
        color: "#444",
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
    },
});