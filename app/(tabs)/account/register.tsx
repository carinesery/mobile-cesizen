import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { registerUserBodySchema } from "@/schemas/authSchema";
import PasswordInput from "@/components/PasswordInput";
import { authService } from "@/services";

export default function RegisterScreen() {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [termsConsent, setTermsConsent] = useState(false);
    const [privacyConsent, setPrivacyConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);

        // 1️⃣ Validation Zod
        const parsed = registerUserBodySchema.safeParse({
            username,
            email,
            password,
            confirmPassword,
            termsConsent,
            privacyConsent
        });

        if (!parsed.success) {
            const messages = parsed.error.errors.map(e => e.message).join("\n");
            Alert.alert("Erreur de formulaire", messages);
            return;
        }

        // 2️⃣ Appel au backend
        try {
            setLoading(true);
            await authService.register({
                username,
                email,
                password,
                termsConsent,
                privacyConsent
            });

            Alert.alert("Inscription réussie !", "Vous pouvez maintenant vous connecter");

            // 3️⃣ Optionnel : login auto
            // await login(email, password);

            router.replace("/account/login");
        } catch (err: any) {
            console.log("RegisterScreen reçoit :", err);
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
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Créer un compte</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TextInput
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <PasswordInput
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                />

                <PasswordInput
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <View style={styles.checkboxContainer}>
                    <TouchableOpacity onPress={() => setTermsConsent(!termsConsent)}>
                        <Text style={styles.checkbox}>{termsConsent ? "☑" : "☐"} J'accepte les conditions d'utilisation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setPrivacyConsent(!privacyConsent)}>
                        <Text style={styles.checkbox}>{privacyConsent ? "☑" : "☐"} J'accepte la politique de confidentialité</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
                ) : (
                    <Button title="S'inscrire" onPress={handleRegister} />
                )}

                <TouchableOpacity onPress={() => router.push("/account/login")} style={{ marginTop: 15 }}>
                    <Text style={styles.linkText}>Vous avez déjà un compte ? Se connecter</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
    errorText: { color: "red", marginBottom: 10, textAlign: "center" },
    checkboxContainer: { marginBottom: 20 },
    checkbox: { marginBottom: 10 },
    linkText: { color: "#007AFF", textAlign: "center", textDecorationLine: "underline" }
});