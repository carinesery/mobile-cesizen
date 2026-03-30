import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router/build/exports";

export default function LogoutScreen() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout(); // ✅ Attendre que la déconnexion soit complète
            Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
            router.replace("/account/register");

        } catch (error) {
            Alert.alert("Erreur", "Impossible de se déconnecter. Veuillez réessayer.");
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Déconnexion</Text>
            <Text style={styles.message}>Voulez-vous vraiment vous déconnecter ?</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Se déconnecter</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
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
    },
    message: {
        fontSize: 18,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 15,
    },
    cancelButton: {
        backgroundColor: "#007AFF",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});