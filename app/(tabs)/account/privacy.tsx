import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Politique de confidentialité</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
                Nous prenons la protection de vos données personnelles très au sérieux. Cette politique décrit quelles informations nous collectons, pourquoi et comment nous les utilisons.
            </Text>

            <Text style={styles.sectionTitle}>2. Données collectées</Text>
            <Text style={styles.text}>
                Nous collectons votre nom, email, informations de compte et toute donnée que vous choisissez de fournir lors de l'utilisation de l'application.
            </Text>

            <Text style={styles.sectionTitle}>3. Utilisation des données</Text>
            <Text style={styles.text}>
                Vos données sont utilisées pour fournir et améliorer nos services, communiquer avec vous et respecter nos obligations légales.
            </Text>

            <Text style={styles.sectionTitle}>4. Partage des données</Text>
            <Text style={styles.text}>
                Nous ne partageons vos données personnelles avec des tiers que si nécessaire pour fournir nos services, ou si la loi l'exige.
            </Text>

            <Text style={styles.sectionTitle}>5. Sécurité des données</Text>
            <Text style={styles.text}>
                Nous mettons en place des mesures de sécurité pour protéger vos données contre tout accès ou divulgation non autorisé.
            </Text>

            <Text style={styles.sectionTitle}>6. Vos droits</Text>
            <Text style={styles.text}>
                Vous pouvez accéder à vos données, les corriger, demander leur suppression ou retirer votre consentement à tout moment en nous contactant.
            </Text>

            <Text style={styles.sectionTitle}>7. Modifications</Text>
            <Text style={styles.text}>
                Nous pouvons mettre à jour cette politique. Les changements seront publiés dans l'application avec la date de mise à jour.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
    text: { fontSize: 16, lineHeight: 22 }
});