import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function CGUScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Conditions Générales d'Utilisation</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>
                Bienvenue sur notre application. En utilisant notre service, vous acceptez ces conditions générales...
            </Text>

            <Text style={styles.sectionTitle}>2. Utilisation du service</Text>
            <Text style={styles.text}>
                Vous vous engagez à utiliser l'application conformément aux lois en vigueur et à ne pas effectuer d'activités interdites...
            </Text>

            <Text style={styles.sectionTitle}>3. Données personnelles</Text>
            <Text style={styles.text}>
                Nous collectons et traitons vos données personnelles conformément à notre politique de confidentialité...
            </Text>

            <Text style={styles.sectionTitle}>4. Responsabilité</Text>
            <Text style={styles.text}>
                L'application est fournie "telle quelle". Nous ne garantissons pas la disponibilité, la sécurité ou l'absence d'erreurs.
            </Text>

            <Text style={styles.sectionTitle}>5. Modifications</Text>
            <Text style={styles.text}>
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications seront effectives immédiatement après publication.
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