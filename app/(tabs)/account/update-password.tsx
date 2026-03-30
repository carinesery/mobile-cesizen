import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import PasswordInput from "@/components/PasswordInput";
import { authService } from "@/services";
import { useRouter } from "expo-router";

export default function ChangePasswordScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert("Erreur", "Merci de remplir tous les champs");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Erreur", "Le nouveau mot de passe et sa confirmation ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      // Appel backend pour changer le mot de passe
      await authService.updatePassword({
        currentPassword,
        newPassword
      });

      Alert.alert("Succès", "Votre mot de passe a été modifié");
      router.replace("/account"); // ou naviguer vers la page de profil

    } catch (error: any) {
      console.log("Erreur update password:", error);
      Alert.alert("Erreur", error.message || "Impossible de modifier le mot de passe");
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
        <Text style={styles.title}>Modifier le mot de passe</Text>

        <PasswordInput
          placeholder="Mot de passe actuel"
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <PasswordInput
          placeholder="Nouveau mot de passe"
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <PasswordInput
          placeholder="Confirmer le nouveau mot de passe"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <Button title="Modifier le mot de passe" onPress={handleChangePassword} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
});