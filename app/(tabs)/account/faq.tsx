import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function FAQScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Foire Aux Questions (FAQ)</Text>

            <Text style={styles.question}>Q1 : Comment créer un compte ?</Text>
            <Text style={styles.answer}>
                Pour créer un compte, appuyez sur le bouton "S'inscrire" et remplissez le formulaire avec votre email et mot de passe.
            </Text>

            <Text style={styles.question}>Q2 : Comment confirmer mon email ?</Text>
            <Text style={styles.answer}>
                Après inscription, vous recevrez un email avec un lien de confirmation. Cliquez dessus pour activer votre compte.
            </Text>

            <Text style={styles.question}>Q3 : J'ai oublié mon mot de passe, que faire ?</Text>
            <Text style={styles.answer}>
                Allez sur "Mot de passe oublié", entrez votre email et suivez les instructions pour réinitialiser votre mot de passe.
            </Text>

            <Text style={styles.question}>Q4 : Comment contacter le support ?</Text>
            <Text style={styles.answer}>
                Vous pouvez nous contacter via la section "Contact" de l'application ou par email à support@example.com.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    question: { fontSize: 18, fontWeight: 'bold', marginTop: 12 },
    answer: { fontSize: 16, marginTop: 4, lineHeight: 22 }
});