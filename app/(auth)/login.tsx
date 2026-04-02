// Affiche le formulaire de connexion et un lien vers mot de passe oublié
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
    Text,
    View,
    TextInput, Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Image } from 'expo-image';
import { Ionicons } from "@expo/vector-icons";
import loginUserBodySchema from "../../schemas/authSchema";
import PasswordInput from "@/components/PasswordInput";
import { Footer } from "@/components/Footer";
import { COLORS, SPACING, DIMENSIONS } from "@/constants/theme";

export default function LoginScreen() {
    const { redirect } = useLocalSearchParams();
    const router = useRouter();

    const { login, loading, user } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            if (redirect && typeof redirect === "string") {
                router.replace(redirect);
            } else {
                router.replace("/(tabs)/account");
            }
        }
    }, [user]);

    const handleLogin = async () => {
        Keyboard.dismiss();
        try {
            const result = loginUserBodySchema.safeParse({ email, password });
            if (!result.success) {
                const messages = result.error.errors.map(e => e.message).join("\n");
                Alert.alert("Erreur de formulaire", messages);
                return;
            }
            await login(email, password);
        } catch (error: any) {
            setError(error.message);
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
                        <Text style={styles.title}>Connectez-vous</Text>
                        <Text style={styles.subtitle}>
                            Avec CESIZen, prenez soin de votre{'\n'}santé mentale
                        </Text>
                    </View>

                    {/* Segment Connexion / Inscription */}
                    <View style={styles.segmentedControl}>
                        <TouchableOpacity style={[styles.segment, styles.segmentActive]}>
                            <Text style={[styles.segmentText, styles.segmentTextActive]}>Connexion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.segment}
                            onPress={() => router.replace("/(auth)/register")}
                        >
                            <Text style={styles.segmentText}>Inscription</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Formulaire */}
                    <View style={styles.form}>
                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

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

                        {/* Bouton Se connecter */}
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>Se connecter</Text>
                            )}
                        </TouchableOpacity>

                        {/* Mot de passe oublié */}
                        <TouchableOpacity style={styles.linkContainer}>
                            <Text style={styles.linkText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.linkContainer}
                            onPress={() => router.push("/(auth)/confirm-email")}
                        >
                            <Text style={styles.confirmEmailLink}>
                                Confirmer mon adresse email
                            </Text>
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
    linkText: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: '500',
    },
    linkSecondary: {
        color: COLORS.textLight,
        fontSize: 13,
    },
    linkAccent: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    confirmEmailLink: {
        color: COLORS.accent,
        fontSize: 14,
        fontWeight: '700',
    },
});


















// import { useState } from 'react';
// import { View, ScrollView, StyleSheet, Text } from 'react-native';
// import { Link } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Container, TextInput, Button, ErrorAlert, Loading } from '../../components/index';
// import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: SPACING.md,
//   },
//   header: {
//     marginBottom: SPACING.xl,
//     alignItems: 'center',
//   },
//   title: {
//     ...TYPOGRAPHY.title,
//     color: COLORS.primary,
//   },
//   form: {
//     marginBottom: SPACING.lg,
//     gap: SPACING.md,
//   },
//   links: {
//     gap: SPACING.md,
//   },
// });

// export default function LoginScreen() {
//   const { login, isLoading, error, clearError } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       return;
//     }

//     try {
//       await login({ email, password });
//     } catch (err) {
//       // Error handled by context
//     }
//   };

//   return (
//     <Container>
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>CESIZen</Text>
//         </View>

//         {error && <ErrorAlert type="error" message={error} onDismiss={clearError} />}

//         <View style={styles.form}>
//           <TextInput
//             label="Email"
//             placeholder="votre@email.com"
//             value={email}
//             onChangeText={setEmail}
//             editable={!isLoading}
//           />

//           <TextInput
//             label="Mot de passe"
//             placeholder="••••••••"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             editable={!isLoading}
//           />

//           <Button
//             title={isLoading ? 'Connexion...' : 'Connexion'}
//             onPress={handleLogin}
//             disabled={isLoading}
//           />
//         </View>

//         <View style={styles.links}>
//           <Link href="/(auth)/forgot-password" asChild>
//             <Button
//               title="Mot de passe oublié?"
//               variant="outline"
//               disabled={isLoading}
//             />
//           </Link>

//           <Link href="/(auth)/register" asChild>
//             <Button
//               title="Créer un compte"
//               variant="secondary"
//               disabled={isLoading}
//             />
//           </Link>
//         </View>

//         {isLoading && <Loading />}
//       </ScrollView>
//     </Container>
//   );
// }
