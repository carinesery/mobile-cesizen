import { useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services';
import { COLORS, SPACING, DIMENSIONS } from '@/constants/theme';
import { Footer } from '@/components/Footer';

export default function ConfirmEmailScreen() {
    const router = useRouter();
    const [emailInput, setEmailInput] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const extractToken = (input: string): string => {
        if (!input) return '';
        const match = input.match(/token=([^&\s]+)/);
        return match ? match[1] : '';
    };

    const handleEmailChange = (text: string) => {
        setEmailInput(text);
        const extractedToken = extractToken(text);
        if (extractedToken) {
            setToken(extractedToken);
        }
    };

    const handleConfirm = async () => {
        Keyboard.dismiss();
        if (!token) {
            Alert.alert("Erreur", "Veuillez coller le lien de confirmation reçu par email");
            return;
        }
        try {
            setLoading(true);
            await authService.confirmEmail(token);
            Alert.alert("Succès", "Votre email a été confirmé !", [
                { text: "Se connecter", onPress: () => router.replace("/(tabs)/account") }
            ]);
        } catch (error: any) {
            Alert.alert("Erreur", error.message || "Impossible de confirmer l'email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Confirmez votre email</Text>
                        <Text style={styles.subtitle}>
                            Collez le lien reçu dans votre{'\n'}boîte de réception
                        </Text>
                        <Image
                            source={require('../../assets/lotus.png')}
                            style={styles.lotus}
                            contentFit='contain'
                        />
                    </View>

                    {/* Formulaire */}
                    <View style={styles.formContainer}>
                        <View style={styles.stepRow}>
                            <View style={styles.stepBadge}>
                                <Text style={styles.stepNumber}>1</Text>
                            </View>
                            <Text style={styles.stepText}>Ouvrez l'email de confirmation CESIZen</Text>
                        </View>

                        <View style={styles.stepRow}>
                            <View style={styles.stepBadge}>
                                <Text style={styles.stepNumber}>2</Text>
                            </View>
                            <Text style={styles.stepText}>Copiez le lien de confirmation</Text>
                        </View>

                        <View style={styles.stepRow}>
                            <View style={styles.stepBadge}>
                                <Text style={styles.stepNumber}>3</Text>
                            </View>
                            <Text style={styles.stepText}>Collez-le ci-dessous</Text>
                        </View>

                        <Text style={styles.label}>Lien de confirmation</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="link-outline" size={18} color={COLORS.neutral.gray} />
                            <TextInput
                                value={emailInput}
                                onChangeText={handleEmailChange}
                                placeholder="https://...?token=abc123"
                                style={styles.input}
                                placeholderTextColor={COLORS.neutral.gray}
                                autoCapitalize="none"
                                multiline
                            />
                        </View>

                        {token ? (
                            <View style={styles.tokenFound}>
                                <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                                <Text style={styles.tokenFoundText}>Token détecté</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.primaryButton, !token && styles.buttonDisabled]}
                            onPress={handleConfirm}
                            disabled={!token || loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Confirmer mon email</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Footer marginTop={SPACING.lg} />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },
    lotus: {
        width: 50,
        height: 50,
        marginTop: SPACING.md,
    },
    formContainer: {
        backgroundColor: '#F1FDFB',
        borderRadius: DIMENSIONS.borderRadius.xl,
        padding: SPACING.lg,
        gap: SPACING.sm,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingVertical: SPACING.xs,
    },
    stepBadge: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumber: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
        fontWeight: '500',
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginTop: SPACING.sm,
        marginBottom: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: DIMENSIONS.borderRadius.lg,
        paddingHorizontal: SPACING.sm + 4,
        paddingVertical: SPACING.xs,
        gap: SPACING.sm,
        minHeight: 80,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
        paddingVertical: 10,
    },
    tokenFound: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    tokenFoundText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: DIMENSIONS.borderRadius.lg,
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});