// app/account/legal/index.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";

export default function LegalsScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Mentions légales</Text>

            {/* Bloc CGU */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/cgu")}
            >
                <Text style={styles.buttonText}>Conditions générales</Text>
            </TouchableOpacity>

            {/* Bloc Politique de confidentialité */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/privacy")}
            >
                <Text style={styles.buttonText}>Politique de confidentialité</Text>
            </TouchableOpacity>

            {/* Bloc FAQ */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/account/faq")}
            >
                <Text style={styles.buttonText}>FAQ</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    buttonText: {
        fontSize: 16,
        color: "#007AFF",
        fontWeight: "500",
    },
});