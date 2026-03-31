import { useRouter } from "expo-router";
import { Text, View, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "@/context/AuthContext";


export default function AccountScreen() {
    const router = useRouter();
    const { user, initializing } = useAuth();

    // Chargement initial
    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    // Pas connecté → afficher un écran invitant à se connecter (PAS de redirect !)
    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Mon compte</Text>
                <Text style={{ fontSize: 16, color: "#666", marginBottom: 30, textAlign: "center" }}>
                    Connectez-vous pour accéder à votre compte
                </Text>
                <TouchableOpacity
                    style={[styles.button, { width: '80%' }]}
                    onPress={() => router.push("/(auth)/login")}
                >
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, { width: '80%', backgroundColor: '#34C759' }]}
                    onPress={() => router.push("/(auth)/register")}
                >
                    <Text style={styles.buttonText}>Créer un compte</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(auth)/confirm-email")}
                    style={{ marginTop: 15 }}
                >
                    <Text style={{ color: '#007AFF', fontSize: 14, textDecorationLine: 'underline' }}>
                        Je viens de créer mon compte, je confirme mon email
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Si connecté --> affiche les blocs profil, CGU, faq 
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* <Text style={styles.title}>Mon Compte</Text> */}

            {/* Vers profil */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/profile")}
            >
                <Text style={styles.buttonText}>Consulter mon profil</Text>
            </TouchableOpacity>

            {/* Vers legal */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/legals")}
            >
                <Text style={styles.buttonText}>Conditions générales</Text>
            </TouchableOpacity>
            {/* Vers legal */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/logout")}
            >
                <Text style={styles.buttonText}>Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/secure")}
            >
                <Text style={styles.buttonText}>Zone de danger</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#007AFF",
        textAlign: "center",
        marginBottom: 40,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // pour Android
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});