// Affiche le formulaire de connextion et un lien vers mot de passe oublié
import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { useState, useEffect } from "react";
import {
    Text,
    View, Button,
    TextInput, Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import loginUserBodySchema from "../../../schemas/authSchema";

export default function LoginScreen() {

    const { login, user, loading, error, clearError } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        Keyboard.dismiss();
        loading;
        try {

            // Validation Zod avant de login
            const result = loginUserBodySchema.safeParse({ email, password });
            if (!result.success) {
                const messages = result.error.errors.map(e => e.message).join("\n");
                Alert.alert("Erreur de formulaire", messages);
                return;
            }

            const data = await login(email, password);

            console.log("Login réussi :", data);

            //   if (!data.response.ok) {
            // setError(data.message); // 👈 ICI
            // return;
        // }
    }
        catch (error) {
            console.log("Erreur login :", error);
        } finally {
            !loading;
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert("Erreur", error, [{ text: "OK", onPress: clearError }]);
        }
    }, [error]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (user && !loading) {
        return <Redirect href="/account/profile" />
    }

    // peut rediriger vers l'écran mot de passe oublié
    // ou vers l'écran d'inscription register.tsx
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >


            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Connexion</Text>

                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Button title="Se connecter" onPress={handleLogin} />
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
