import { ScrollView, Text, View, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";
import { articleService } from "../../../services/articleService";
import { Article } from "../../../types/article";
import { useLocalSearchParams, Stack } from "expo-router";
import { Chips } from "@/components/Chips";
import { SPACING, COLORS } from "@/constants";
import Markdown from "react-native-markdown-display";
import { Ionicons } from "@expo/vector-icons";
import { LoadingScreen } from "@/components/LoadingScreen";

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

    if (!currentArticle) return <LoadingScreen message="Chargement de l'article..." />;

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
                            <Chips key={cat.slug} category={cat.title} />
                        ))}
                    </View>

                    {/* TITLE */}
                    <Text style={styles.title}>{currentArticle?.title}</Text>

                    {/* DATE */}
                    <View style={styles.infosContainer}>
                        <Text style={styles.date}>
                            {new Date(currentArticle?.createdAt || '').toLocaleDateString()}
                        </Text >
                        <View style={styles.authorContainer}>
                            <Ionicons name="person-outline" size={16} style={{ paddingHorizontal: SPACING.xs }} color={COLORS.neutral.gray} />
                            <Text style={styles.infos}>Ministère de la santé</Text>
                        </View>
                    </View>
                    <View style={styles.articleContent}>
                        {/* SUMMARY */}
                        {currentArticle?.summary && (
                            <Text style={styles.summary}>{currentArticle.summary}</Text>
                        )}

                        {/* CONTENT */}
                        {currentArticle?.content && (
                            <Markdown style={markdownStyles}>{currentArticle.content}</Markdown>
                        )}
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        color: COLORS.text
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
        gap: SPACING.sm
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
        fontSize: 32,
        fontWeight: "bold",
        paddingVertical: 15,
        color: COLORS.primary,
    },
    date: {
        fontSize: 12,
        color: "#888",
    },
    infosContainer: {
        alignItems: 'flex-end',
        gap: SPACING.xs,
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
    },
    articleContent: {
            marginTop: SPACING.lg,
    },
    summary: {
        fontSize: 16,
        fontStyle: "italic",
        marginBottom: 16,
        color: "#444",
    },
});

const markdownStyles = StyleSheet.create({
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: "#333",
    },
    heading1: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
        color: "#111",
    },
    heading2: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 16,
        marginBottom: 8,
        color: "#222",
    },
    heading3: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 6,
        color: "#333",
    },
    paragraph: {
        marginBottom: 12,
    },
    strong: {
        fontWeight: "bold",
    },
    em: {
        fontStyle: "italic",
    },
    bullet_list: {
        marginBottom: 12,
    },
    ordered_list: {
        marginBottom: 12,
    },
    list_item: {
        marginBottom: 4,
    },
});