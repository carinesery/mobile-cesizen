import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const sections = [
    {
        title: 'Introduction',
        text: "Bienvenue sur notre application. En utilisant notre service, vous acceptez ces conditions générales...",
    },
    {
        title: 'Utilisation du service',
        text: "Vous vous engagez à utiliser l'application conformément aux lois en vigueur et à ne pas effectuer d'activités interdites...",
    },
    {
        title: 'Données personnelles',
        text: 'Nous collectons et traitons vos données personnelles conformément à notre politique de confidentialité...',
    },
    {
        title: 'Responsabilité',
        text: "L'application est fournie \"telle quelle\". Nous ne garantissons pas la disponibilité, la sécurité ou l'absence d'erreurs.",
    },
    {
        title: 'Modifications',
        text: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives immédiatement après publication.',
    },
];

export default function CGUScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <View style={styles.iconCircle}>
                    <Ionicons name="document-text" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.subtitle}>Conditions d'utilisation de CESIZen</Text>
            </View>

            {sections.map((section, i) => (
                <View key={i} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.numberBadge}>
                            <Text style={styles.numberText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <Text style={styles.text}>{section.text}</Text>
                </View>
            ))}

            <Text style={styles.updateDate}>Dernière mise à jour : 1er avril 2026</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
        gap: SPACING.sm,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F1FDFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm + 2,
        marginBottom: SPACING.sm,
    },
    numberBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
    },
    text: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 21,
        paddingLeft: 40,
    },
    updateDate: {
        fontSize: 12,
        color: COLORS.neutral.gray,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
});