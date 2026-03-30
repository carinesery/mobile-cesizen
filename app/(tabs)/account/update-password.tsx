import { useState } from "react";
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { updatedPasswordSchema } from "@/schemas/profileSchema";
import PasswordInput from "@/components/PasswordInput";
import { authService, profileService } from "@/services";
import { router } from "expo-router";

export default function UpdatePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ==== SUBMIT ====
    const handleUpdatePassword = async () => {
        setError(null);

        // 1️⃣ Validation Zod
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

        // 2️⃣ Appel API
        try {
            setLoading(true);

            await profileService.updatePassword({
                currentPassword,
                newPassword
            });

            Alert.alert("Succès", "Mot de passe mis à jour !");

            router.back();

        } catch (err: any) {
            console.log("UpdatePasswordScreen reçoit :", err);
            setError(err.message || "Erreur lors de la mise à jour");
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
                <Text style={styles.title}>Changer le mot de passe</Text>

                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* CURRENT PASSWORD */}
                <PasswordInput
                    placeholder="Mot de passe actuel"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />

                {/* NEW PASSWORD */}
                <PasswordInput
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                {/* CONFIRM */}
                <PasswordInput
                    placeholder="Confirmer le nouveau mot de passe"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
                ) : (
                    <Button title="Mettre à jour" onPress={handleUpdatePassword} />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
});