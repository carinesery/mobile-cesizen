// app/account/register.tsx
import { useState } from "react";
import {
    View, Text, TextInput, Button, Alert, StyleSheet,
    ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
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

        // Vérifier mime type
        if (!asset.uri || !asset.type?.startsWith("image")) {
            Alert.alert("Erreur", "Seules les images sont acceptées");
            return;
        }

        // Vérifier taille max 5MB
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (!fileInfo.exists || (fileInfo.size && fileInfo.size > 5 * 1024 * 1024)) {
            Alert.alert("Erreur", "Le fichier est trop volumineux (max 5MB)");
            return;
        }

        // Stocker l'asset
        setImage(asset);
    };

    // ==== Préparer FormData pour l'upload ====
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("termsConsent", String(termsConsent));
    formData.append("privacyConsent", String(privacyConsent));

    if (image) {
        formData.append("profilPicture", {
            uri: image.uri, // asset.uri
            name: `profile_${Date.now()}.jpg`, // nom unique
            type: "image/jpeg", // tu peux ajuster selon asset.type
        } as any);
    }

    // ==== Soumission formulaire ====
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

        // 2️⃣ Préparer FormData
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('termsConsent', String(termsConsent));
        formData.append('privacyConsent', String(privacyConsent));

        if (image) {
            formData.append('profilPicture', {
                uri: image.uri,
                name: 'profile.jpg',
                type: 'image/jpeg',
            } as any);
        }

        // 3️⃣ Appel backend
        try {
            setLoading(true);

            await authService.register(formData);

            Alert.alert("Inscription réussie !", "Vous devez maintenant confirmer votre adresse email");

            // Rediriger vers la confirmation d'email
            router.replace("/(auth)/confirm-email");

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

                {/* Image */}
                <TouchableOpacity onPress={pickImage} style={{ marginBottom: 15, alignItems: 'center' }}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 5 }} />
                    ) : (
                        <View style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                            <Text style={{ color: '#007AFF' }}>Choisir une image</Text>
                        </View>
                    )}
                </TouchableOpacity>

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

                <TouchableOpacity onPress={() => router.push("/(auth)/login")} style={{ marginTop: 15 }}>
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