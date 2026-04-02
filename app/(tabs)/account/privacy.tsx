import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const sections = [
    {
        title: 'Introduction',
        text: 'Nous prenons la protection de vos données personnelles très au sérieux. Cette politique décrit quelles informations nous collectons, pourquoi et comment nous les utilisons.',
    },
    {
        title: 'Données collectées',
        text: "Nous collectons votre nom, email, informations de compte et toute donnée que vous choisissez de fournir lors de l'utilisation de l'application.",
    },
    {
        title: 'Utilisation des données',
        text: 'Vos données sont utilisées pour fournir et améliorer nos services, communiquer avec vous et respecter nos obligations légales.',
    },
    {
        title: 'Partage des données',
        text: "Nous ne partageons vos données personnelles avec des tiers que si nécessaire pour fournir nos services, ou si la loi l'exige.",
    },
    {
        title: 'Sécurité des données',
        text: 'Nous mettons en place des mesures de sécurité pour protéger vos données contre tout accès ou divulgation non autorisé.',
    },
    {
        title: 'Vos droits',
        text: 'Vous pouvez accéder à vos données, les corriger, demander leur suppression ou retirer votre consentement à tout moment en nous contactant.',
    },
    {
        title: 'Modifications',
        text: "Nous pouvons mettre à jour cette politique. Les changements seront publiés dans l'application avec la date de mise à jour.",
    },
];

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <View style={styles.iconCircle}>
                    <Ionicons name="shield-checkmark" size={32} color={COLORS.accent} />
                </View>
                <Text style={styles.subtitle}>Comment nous protégeons vos données</Text>
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
        backgroundColor: '#E3E3FA',
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
        backgroundColor: COLORS.backgroundVisible,
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.accent,
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