// app/account/register.tsx
import { useState } from "react";
import {
    View, Text, TextInput, Alert, StyleSheet,
    ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity,
    TouchableWithoutFeedback, Keyboard,
} from "react-native";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { registerUserBodySchema } from "@/schemas/authSchema";
import PasswordInput from "@/components/PasswordInput";
import { authService } from "@/services";
import { Footer } from "@/components/Footer";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";

export default function RegisterScreen() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsConsent, setTermsConsent] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ==== Sélection d'image ====
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission refusée", "Autorisez l'accès à la galerie pour sélectionner une image.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled || !result.assets || result.assets.length === 0) return;

        const asset = result.assets[0];

        if (!asset.uri || !asset.type?.startsWith("image")) {
            Alert.alert("Erreur", "Seules les images sont acceptées");
            return;
        }

        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (!fileInfo.exists || (fileInfo.size && fileInfo.size > 5 * 1024 * 1024)) {
            Alert.alert("Erreur", "Le fichier est trop volumineux (max 5MB)");
            return;
        }

        setImage(asset);
    };

    // ==== Soumission formulaire ====
    const handleRegister = async () => {
        Keyboard.dismiss();
        setError(null);

        const parsed = registerUserBodySchema.safeParse({
            username, email, password, confirmPassword, termsConsent, privacyConsent
        });

        if (!parsed.success) {
            const messages = parsed.error.errors.map(e => e.message).join("\n");
            Alert.alert("Erreur de formulaire", messages);
            return;
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('termsConsent', String(termsConsent));
        formData.append('privacyConsent', String(privacyConsent));

        if (image) {
            formData.append('profilPicture', {
                uri: image.uri, name: 'profile.jpg', type: 'image/jpeg',
            } as any);
        }

        try {
            setLoading(true);
            await authService.register(formData);
            Alert.alert("Inscription réussie !", "Vous devez maintenant confirmer votre adresse email");
            router.replace("/(auth)/confirm-email");
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    style={styles.screen}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo + Titre */}
                    <View style={styles.header}>
                        <Image
                            source={require('../../assets/lotus.png')}
                            style={styles.lotus}
                            contentFit='contain'
                        />
                        <Text style={styles.title}>Inscrivez-vous</Text>
                        <Text style={styles.subtitle}>
                            Avec CESIZen, prenez soin de votre{'\n'}santé mentale
                        </Text>
                    </View>

                    {/* Segment Connexion / Inscription */}
                    <View style={styles.segmentedControl}>
                        <TouchableOpacity
                            style={styles.segment}
                            onPress={() => router.replace("/(auth)/login")}
                        >
                            <Text style={styles.segmentText}>Connexion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.segment, styles.segmentActive]}>
                            <Text style={[styles.segmentText, styles.segmentTextActive]}>Inscription</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Formulaire */}
                    <View style={styles.form}>
                        {error && <Text style={styles.errorText}>{error}</Text>}

                        <Text style={styles.label}>Nom d'utilisateur</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={18} color={COLORS.neutral.gray} />
                            <TextInput
                                placeholder="Votre nom d'utilisateur"
                                value={username}
                                onChangeText={setUsername}
                                style={styles.input}
                                placeholderTextColor={COLORS.neutral.gray}
                            />
                        </View>

                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.neutral.gray} />
                            <TextInput
                                placeholder="exemple@email.com"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor={COLORS.neutral.gray}
                            />
                        </View>

                        <Text style={styles.label}>Mot de passe</Text>
                        <PasswordInput
                            placeholder="Votre mot de passe"
                            value={password}
                            onChangeText={setPassword}
                        />

                        <Text style={styles.label}>Confirmation du mot de passe</Text>
                        <PasswordInput
                            placeholder="Confirmez votre mot de passe"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />

                        {/* Checkboxes */}
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setTermsConsent(!termsConsent)}
                        >
                            <Ionicons
                                name={termsConsent ? "checkbox" : "square-outline"}
                                size={20}
                                color={termsConsent ? COLORS.primary : COLORS.neutral.gray}
                            />
                            <Text style={styles.checkboxText}>
                                J'accepte les{' '}
                                <Text style={styles.checkboxLink} onPress={() => router.push('/(tabs)/account/cgu')}>
                                    conditions générales d'utilisation
                                </Text>
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={() => setPrivacyConsent(!privacyConsent)}
                        >
                            <Ionicons
                                name={privacyConsent ? "checkbox" : "square-outline"}
                                size={20}
                                color={privacyConsent ? COLORS.primary : COLORS.neutral.gray}
                            />
                            <Text style={styles.checkboxText}>
                                J'accepte la{' '}
                                <Text style={styles.checkboxLink} onPress={() => router.push('/(tabs)/account/privacy')}>
                                    politique de confidentialité
                                </Text>
                            </Text>
                        </TouchableOpacity>

                        {/* Bouton S'inscrire */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>S'inscrire</Text>
                            )}
                        </TouchableOpacity>


                    </View>

                    {/* Footer */}
                    <Footer marginTop={SPACING.lg} />
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    lotus: {
        width: 70,
        height: 70,
        marginBottom: SPACING.md,
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
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: 3,
        marginBottom: SPACING.lg,
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: DIMENSIONS.borderRadius.md,
        alignItems: 'center',
    },
    segmentActive: {
        backgroundColor: COLORS.primary,
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
    },
    segmentTextActive: {
        color: '#fff',
    },
    form: {
        gap: SPACING.xs,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
        borderRadius: DIMENSIONS.borderRadius.lg,
        paddingHorizontal: SPACING.sm + 4,
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 14,
        color: COLORS.text,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 13,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm,
        paddingVertical: SPACING.xs,
    },
    checkboxText: {
        flex: 1,
        fontSize: 12,
        color: COLORS.textLight,
        lineHeight: 18,
    },
    checkboxLink: {
        color: COLORS.accent,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: DIMENSIONS.borderRadius.lg,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkContainer: {
        alignItems: 'center',
        paddingVertical: SPACING.xs,
    },
    linkSecondary: {
        color: COLORS.textLight,
        fontSize: 13,
    },
    linkAccent: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});