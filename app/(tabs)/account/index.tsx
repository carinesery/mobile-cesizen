import { useRouter } from "expo-router";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator, Image } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import { Footer } from "@/components/Footer";
import loginUserBodySchema, { registerUserBodySchema } from "@/schemas/authSchema";
import { authService } from "@/services";


export default function AccountScreen() {
    const router = useRouter();
    const { user, initializing, login, logout } = useAuth();
    const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

    // Login state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);

    // Register state
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsConsent, setTermsConsent] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);

    const handleLogin = async () => {
        Keyboard.dismiss();
        setLoginError(null);
        const result = loginUserBodySchema.safeParse({ email, password });
        if (!result.success) {
            Alert.alert("Erreur de formulaire", result.error.errors.map(e => e.message).join("\n"));
            return;
        }
        try {
            setLoginLoading(true);
            await login(email, password);
        } catch (error: any) {
            setLoginError(error.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async () => {
        Keyboard.dismiss();
        setRegisterError(null);
        const parsed = registerUserBodySchema.safeParse({
            username: regUsername, email: regEmail, password: regPassword, confirmPassword, termsConsent, privacyConsent
        });
        if (!parsed.success) {
            Alert.alert("Erreur de formulaire", parsed.error.errors.map(e => e.message).join("\n"));
            return;
        }
        const formData = new FormData();
        formData.append('username', regUsername);
        formData.append('email', regEmail);
        formData.append('password', regPassword);
        formData.append('confirmPassword', confirmPassword);
        formData.append('termsConsent', String(termsConsent));
        formData.append('privacyConsent', String(privacyConsent));
        try {
            setRegisterLoading(true);
            await authService.register(formData);
            Alert.alert("Inscription réussie !", "Vous devez maintenant confirmer votre adresse email");
            router.push("/(auth)/confirm-email");
        } catch (err: any) {
            setRegisterError(err.message || "Erreur lors de l'inscription");
        } finally {
            setRegisterLoading(false);
        }
    };

    if (initializing) {
        return <LoadingScreen />;
    }

    // ─── Pas connecté : formulaire login/register inline ───
    if (!user) {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView style={styles.authScreen} contentContainerStyle={styles.authScrollContent} showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.authHeader}>
                            <Text style={styles.authTitle}>{authTab === 'login' ? 'Connectez-vous' : 'Inscrivez-vous'}</Text>
                            <Text style={styles.authSubtitle}>Avec CESIZen, prenez soin de votre{'\n'}santé mentale</Text>
                        </View>

                        {/* Formulaire Login */}
                        {authTab === 'login' && (
                            <View style={styles.formContainer}>
                                {/* Segment control */}
                                <View style={styles.segmentedControl}>
                                    <TouchableOpacity
                                        style={[styles.segment, styles.segmentActiveLogin]}
                                        onPress={() => setAuthTab('login')}
                                    >
                                        <Text style={[styles.segmentText, styles.segmentTextActive]}>Connexion</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.segment}
                                        onPress={() => setAuthTab('register')}
                                    >
                                        <Text style={styles.segmentText}>Inscription</Text>
                                    </TouchableOpacity>
                                </View>

                                {loginError && <Text style={styles.errorText}>{loginError}</Text>}

                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={18} color={COLORS.neutral.gray} />
                                    <TextInput placeholder="exemple@email.com" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.neutral.gray} />
                                </View>

                                <Text style={styles.label}>Mot de passe</Text>
                                <PasswordInput placeholder="Votre mot de passe" value={password} onChangeText={setPassword} />

                                <TouchableOpacity style={[styles.primaryButton, (!email || !password) && styles.buttonDisabled]} onPress={handleLogin} disabled={loginLoading || !email || !password} activeOpacity={0.8}>
                                    {loginLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Se connecter</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.linkContainer}>
                                    <Text style={styles.linkText}>Mot de passe oublié ?</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.linkContainer} onPress={() => router.push("/(auth)/confirm-email")}>
                                    <Text style={styles.confirmEmailLink}>Confirmer mon adresse email</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Formulaire Register */}
                        {authTab === 'register' && (
                            <View style={styles.formContainerRegister}>
                                {/* Segment control */}
                                <View style={styles.segmentedControl}>
                                    <TouchableOpacity
                                        style={styles.segment}
                                        onPress={() => setAuthTab('login')}
                                    >
                                        <Text style={styles.segmentText}>Connexion</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.segment, styles.segmentActiveRegister]}
                                        onPress={() => setAuthTab('register')}
                                    >
                                        <Text style={[styles.segmentText, styles.segmentTextActive]}>Inscription</Text>
                                    </TouchableOpacity>
                                </View>

                                {registerError && <Text style={styles.errorText}>{registerError}</Text>}

                                <Text style={styles.label}>Nom d'utilisateur</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="person-outline" size={18} color={COLORS.neutral.gray} />
                                    <TextInput placeholder="Votre nom d'utilisateur" value={regUsername} onChangeText={setRegUsername} style={styles.input} placeholderTextColor={COLORS.neutral.gray} />
                                </View>

                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="mail-outline" size={18} color={COLORS.neutral.gray} />
                                    <TextInput placeholder="exemple@email.com" value={regEmail} onChangeText={setRegEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={COLORS.neutral.gray} />
                                </View>

                                <Text style={styles.label}>Mot de passe</Text>
                                <PasswordInput placeholder="Votre mot de passe" value={regPassword} onChangeText={setRegPassword} />

                                <Text style={styles.label}>Confirmation du mot de passe</Text>
                                <PasswordInput placeholder="Confirmez votre mot de passe" value={confirmPassword} onChangeText={setConfirmPassword} />

                                <TouchableOpacity style={styles.checkboxRow} onPress={() => setTermsConsent(!termsConsent)}>
                                    <Ionicons name={termsConsent ? "checkbox" : "square-outline"} size={20} color={termsConsent ? COLORS.primary : '#fff'} />
                                    <Text style={styles.checkboxText}>
                                        J'accepte les{' '}
                                        <Text style={styles.checkboxLink} onPress={() => router.push('/(tabs)/account/cgu')}>conditions générales d'utilisation</Text>
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.checkboxRow} onPress={() => setPrivacyConsent(!privacyConsent)}>
                                    <Ionicons name={privacyConsent ? "checkbox" : "square-outline"} size={20} color={privacyConsent ? COLORS.primary : '#fff'} />
                                    <Text style={styles.checkboxText}>
                                        J'accepte la{' '}
                                        <Text style={styles.checkboxLink} onPress={() => router.push('/(tabs)/account/privacy')}>politique de confidentialité</Text>
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.accentButton, (!regUsername || !regEmail || !regPassword || !confirmPassword || !termsConsent || !privacyConsent) && styles.buttonDisabled]} onPress={handleRegister} disabled={registerLoading || !regUsername || !regEmail || !regPassword || !confirmPassword || !termsConsent || !privacyConsent} activeOpacity={0.8}>
                                    {registerLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>S'inscrire</Text>}
                                </TouchableOpacity>
                            </View>
                        )}

                        <Footer marginTop={SPACING.lg} />
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

    // ─── Connecté : menu ───
    const menuItems = [
        { label: 'Consulter mon profil', subtitle: 'Voir et modifier vos informations', icon: 'person-outline' as const, iconColor: COLORS.primary, route: '/account/profile' },
        { label: 'Conditions générales', subtitle: "Conditions d'utilisation", icon: 'document-text-outline' as const, iconColor: COLORS.primary, route: '/account/cgu' },
        { label: 'Politique de confidentialité', subtitle: 'Vos données personnelles', icon: 'shield-checkmark-outline' as const, iconColor: COLORS.primary, route: '/account/privacy' },
        { label: 'FAQ', subtitle: 'Questions fréquentes', icon: 'help-circle-outline' as const, iconColor: COLORS.primary, route: '/account/faq' },
    ];

    const handleLogout = async () => {
        Alert.alert(
            "Déconnexion",
            "Voulez-vous vraiment vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Se déconnecter",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            router.replace("/(auth)/login" as any);
                        } catch (error) {
                            Alert.alert("Erreur", "Impossible de se déconnecter.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
            {/* Header profil */}
            {/* <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    {user.profilPictureUrl ? (
                        <Image source={{ uri: user.profilPictureUrl }} style={styles.avatarImage} />
                    ) : (
                        <Ionicons name="person" size={40} color={COLORS.neutral.gray} />
                    )}
                </View>
                <Text style={styles.profileName}>Mon profil</Text>
                <Text style={styles.profileSubtitle}>Avec CESIZen, prenez soin de votre{'\n'}santé mentale</Text>
            </View> */}

            {/* Menu items */}
            <View style={styles.menuSection}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.route}
                        style={styles.menuItem}
                        onPress={() => router.push(item.route as any)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name={item.icon} size={22} color={item.iconColor} />
                            </View>
                            <View>
                                <Text style={styles.menuItemText}>{item.label}</Text>
                                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={COLORS.neutral.gray} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* À propos */}
            <View style={styles.aboutCard}>
                <Text style={styles.aboutTitle}>À propos de CESIZen</Text>
                <Text style={styles.aboutText}>
                    CESIZen est une application dédiée à votre santé mentale et votre bien-être. Suivez vos émotions, comprenez vos ressentis et prenez soin de vous au quotidien.
                </Text>
                <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            </View>

            {/* Bouton déconnexion */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
            >
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                <Text style={styles.logoutText}>Se déconnecter</Text>
            </TouchableOpacity>

            <Footer marginTop={SPACING.md} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    // ─── Auth inline ───
    authScreen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    authScrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
    },
    authHeader: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    authSubtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 20,
    },
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#E8E8E8',
        borderRadius: DIMENSIONS.borderRadius.lg,
        padding: 3,
        marginBottom: SPACING.sm,
    },
    segment: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: DIMENSIONS.borderRadius.md,
        alignItems: 'center',
    },
    segmentActiveLogin: {
        backgroundColor: COLORS.primary,
    },
    segmentActiveRegister: {
        backgroundColor: '#8E51FF',
    },
    segmentText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textLight,
    },
    segmentTextActive: {
        color: '#fff',
    },
    formContainer: {
        backgroundColor: '#F1FDFB',
        borderRadius: DIMENSIONS.borderRadius.xl,
        padding: SPACING.lg,
        gap: SPACING.sm,
    },
    formContainerRegister: {
        backgroundColor: COLORS.backgroundVisible,
        borderRadius: DIMENSIONS.borderRadius.xl,
        padding: SPACING.lg,
        gap: SPACING.sm,
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
        backgroundColor: '#fff',
        borderRadius: DIMENSIONS.borderRadius.lg,
        paddingHorizontal: SPACING.sm + 4,
        gap: SPACING.sm,
        marginBottom: SPACING.xs,
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
    primaryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: DIMENSIONS.borderRadius.lg,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    accentButton: {
        backgroundColor: '#8E51FF',
        paddingVertical: 14,
        borderRadius: DIMENSIONS.borderRadius.lg,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    buttonDisabled: {
        opacity: 0.5,
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
    linkText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '500',
    },
    confirmEmailLink: {
        color: '#8E51FF',
        fontSize: 14,
        fontWeight: '700',
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
        color: '#8E51FF',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },

    // ─── Écran connecté ───
    screen: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    scrollContent: {
        paddingHorizontal: SPACING.md,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.xl,
        gap: SPACING.md,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E3E3FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        overflow: 'hidden',
    },
    avatarImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 13,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 18,
    },
    menuSection: {
        gap: SPACING.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: SPACING.md,
        borderRadius: DIMENSIONS.borderRadius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm + 4,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#F1FDFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text,
    },
    menuItemSubtitle: {
        fontSize: 12,
        color: COLORS.textLight,
        marginTop: 1,
    },
    aboutCard: {
        backgroundColor: COLORS.secondary,
        borderRadius: DIMENSIONS.borderRadius.xl,
        padding: SPACING.lg,
        marginTop: SPACING.sm,
    },
    aboutTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    aboutText: {
        fontSize: 13,
        color: COLORS.textLight,
        lineHeight: 20,
        marginBottom: SPACING.sm,
    },
    aboutVersion: {
        fontSize: 12,
        color: COLORS.neutral.gray,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        paddingVertical: 14,
        borderRadius: DIMENSIONS.borderRadius.lg,
        borderWidth: 1.5,
        borderColor: COLORS.error,
        // backgroundColor: COLORS.danger,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.error,
    },
    menuItemDanger: {
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    menuItemTextDanger: {
        color: COLORS.error,
    },
});