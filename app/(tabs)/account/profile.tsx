import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router/build/exports";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function ProfileScreen() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Vous devez être connecté pour voir votre profil.</Text>
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Photo de profil */}
      <Image
        source={
          user.profilPictureUrl
            ? { uri: user.profilPictureUrl }
            : { uri: "https://cdn.pixabay.com/photo/2016/12/07/16/15/lotus-1889805_1280.png" } // avatar par défaut si pas de photo
        }
        style={styles.avatar}
      />

      {/* Nom et email */}
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>

      {/* Bouton modifier */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/account/profile-edit")}
      >
        <Text style={styles.buttonText}>Modifier le profil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/account/update-password")}
      >
        <Text style={styles.buttonText}>Modifier mon mot de passe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // rond
    marginBottom: 20,
    backgroundColor: "#eee",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});