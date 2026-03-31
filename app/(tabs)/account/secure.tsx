import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router/build/exports";
import { profileService } from "@/services";

export default function DeleteAccountScreen() {
  const { logout } = useAuth();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible !",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await profileService.deleteAccount(); // Appel de la fonction deleteAccount du context
             
              logout(); // On déconnecte l’utilisateur après suppression
             
              Alert.alert("Compte supprimé", "Votre compte a été supprimé avec succès.");
              
              router.replace("/(auth)/register"); 
            } catch (error) {
                
              Alert.alert(
                "Erreur",
                "Impossible de supprimer le compte. Veuillez réessayer."
              );
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supprimer le compte</Text>
      <Text style={styles.message}>
        Cette action supprimera définitivement votre compte et toutes vos données.
      </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Supprimer mon compte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Annuler</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
  },
  cancelButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});