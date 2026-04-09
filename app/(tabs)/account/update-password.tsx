import { useState } from "react";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import { updatedPasswordSchema } from "@/schemas/profileSchema";
import PasswordInput from "@/components/PasswordInput";
import { profileService } from "@/services";
import { router } from "expo-router";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

export default function UpdatePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { logout } = useAuth();

    const handleUpdatePassword = async () => {
        setError(null);

        const parsed = updatedPasswordSchema.safeParse({
            currentPassword,
            newPassword,
            confirmNewPassword,
        });

        if (!parsed.success) {
            const messages = parsed.error.errors.map(e => e.message).join("\n");
            Alert.alert("Erreur de formulaire", messages);
            return;
        }

        try {
            setLoading(true);

            await profileService.updatePassword({
                currentPassword,
                newPassword
            });
            Alert.alert("Succès", "Mot de passe mis à jour ! Vous allez être déconnecté.");
            await logout();
            router.replace("/(auth)/login");

        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    const isValid = currentPassword && newPassword && confirmNewPassword;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Icône */}
                <View style={styles.iconSection}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-closed" size={32} color={COLORS.accent} />
                    </View>
                    <Text style={styles.subtitle}>Choisissez un nouveau mot de passe sécurisé</Text>
                </View>

                {error && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* Formulaire */}
                <View style={styles.formSection}>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Mot de passe actuel</Text>
                        <PasswordInput
                            placeholder="Entrez votre mot de passe actuel"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                    </View>

                    <View style={styles.separator} />

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Nouveau mot de passe</Text>
                        <PasswordInput
                            placeholder="Entrez le nouveau mot de passe"
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
                        <PasswordInput
                            placeholder="Confirmez le nouveau mot de passe"
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                        />
                    </View>
                </View>

                {/* Info */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
                    </Text>
                </View>

                {/* Bouton */}
                <TouchableOpacity
                    style={[styles.submitButton, (!isValid || loading) && styles.buttonDisabled]}
                    onPress={handleUpdatePassword}
                    disabled={loading || !isValid}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Mettre à jour le mot de passe</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        padding: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    iconSection: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
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
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF0F0',
        padding: SPACING.sm + 4,
        borderRadius: DIMENSIONS.borderRadius.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    errorText: {
        flex: 1,
        color: COLORS.error,
        fontSize: 13,
    },
    formSection: {
        gap: SPACING.md,
        marginBottom: SPACING.lg,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: SPACING.xs,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#F1FDFB',
        padding: SPACING.sm + 4,
        borderRadius: DIMENSIONS.borderRadius.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    submitButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 16,
        borderRadius: DIMENSIONS.borderRadius.full,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});