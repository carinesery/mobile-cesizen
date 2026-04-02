import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

const faqData = [
    {
        question: 'Comment créer un compte ?',
        answer: 'Pour créer un compte, appuyez sur le bouton "S\'inscrire" et remplissez le formulaire avec votre email et mot de passe.',
    },
    {
        question: 'Comment confirmer mon email ?',
        answer: 'Après inscription, vous recevrez un email avec un lien de confirmation. Cliquez dessus pour activer votre compte.',
    },
    {
        question: 'J\'ai oublié mon mot de passe, que faire ?',
        answer: 'Allez sur "Mot de passe oublié", entrez votre email et suivez les instructions pour réinitialiser votre mot de passe.',
    },
    {
        question: 'Comment contacter le support ?',
        answer: 'Vous pouvez nous contacter via la section "Contact" de l\'application ou par email à support@example.com.',
    },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [open, setOpen] = useState(false);
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => setOpen(!open)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.question}>{question}</Text>
                </View>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.neutral.gray}
                />
            </View>
            {open && (
                <Text style={styles.answer}>{answer}</Text>
            )}
        </TouchableOpacity>
    );
}

export default function FAQScreen() {
    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.headerSection}>
                <View style={styles.iconCircle}>
                    <Ionicons name="help-circle" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.subtitle}>Trouvez les réponses à vos questions</Text>
            </View>

            {faqData.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} index={i} />
            ))}
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
        justifyContent: 'space-between',
    },
    cardHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm + 2,
        flex: 1,
        marginRight: SPACING.sm,
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
    question: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
        flex: 1,
    },
    answer: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 21,
        marginTop: SPACING.sm + 2,
        paddingLeft: 40,
    },
});