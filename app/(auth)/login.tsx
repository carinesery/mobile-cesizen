// Affiche le formulaire de connextion et un lien vers mot de passe oublié
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
    Text,
    View, Button,
    TextInput, Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import PasswordInput from "../../../components/PasswordInput";
import loginUserBodySchema from "../../../schemas/authSchema";

export default function LoginScreen() {

    const { login, loading, user } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            router.replace("/account");
        }
    }, [user]);

    const handleLogin = async () => {
        Keyboard.dismiss();

        try {

            // Validation Zod avant de login
            const result = loginUserBodySchema.safeParse({ email, password });
            if (!result.success) {
                const messages = result.error.errors.map(e => e.message).join("\n");
                Alert.alert("Erreur de formulaire", messages);
                return;
            }

            await login(email, password);

        }
        catch (error: any) {
            console.log("LoginScreen reçoit :", error);
            setError(error.message);

        }
    };

    // peut rediriger vers l'écran mot de passe oublié
    // ou vers l'écran d'inscription register.tsx
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {error && (
                <Text style={{ color: "red", marginBottom: 10 }}>
                    {error}
                </Text>
            )}
            {loading && <ActivityIndicator size="large" />}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Connexion</Text>

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />

                    <PasswordInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                    />

                    <Button title="Se connecter" onPress={handleLogin} />

                    {/* === Ici les liens === */}
                    <View style={styles.linksContainer}>
                        <TouchableOpacity onPress={() => router.push("/account/forgot-password")}>
                            <Text style={styles.linkText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push("/account/register")}>
                            <Text style={styles.linkText}>Créer un compte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push("/account/confirm-email")}>
                            <Text style={styles.linkText}>Confirmer mon adresse mail</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    icon: {
        padding: 10,
    },
    linksContainer: {
        marginTop: 20,
        alignItems: "center",
        gap: 10, // si RN >= 0.70, sinon utiliser marginBottom sur chaque lien
    },
    linkText: {
        color: "#007AFF",
        textDecorationLine: "underline",
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
