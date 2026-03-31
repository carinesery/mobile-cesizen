import { useState } from 'react';
import { View, Text, ActivityIndicator, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services';

export default function ConfirmEmailScreen() {
    const router = useRouter();
    const [emailInput, setEmailInput] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    // ✅ Extrait le token de l'URL ou du texte collé
    const extractToken = (input: string): string => {
        if (!input) return '';
        
        // Regex pour extraire le token après "token="
        const match = input.match(/token=([^&\s]+)/);
        return match ? match[1] : '';
    };

    // Quand l'utilisateur colle son adresse email/URL
    const handleEmailChange = (text: string) => {
        setEmailInput(text);
        
        // Essayer d'extraire le token automatiquement
        const extractedToken = extractToken(text);
        if (extractedToken) {
            setToken(extractedToken);
        }
    };

    const handleConfirm = async () => {
        if (!token) {
            Alert.alert("Erreur", "Veuillez coller le lien d'email de confirmation");
            return;
        }

        try {
            setLoading(true);
            await authService.confirmEmail(token);
            Alert.alert("Succès", "Votre email a été confirmé !");
            router.replace("/(auth)/login");
        } catch (error: any) {
            Alert.alert("Erreur", error.message || "Impossible de confirmer l'email");

        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmer votre email</Text>
            
            <Text style={styles.label}>Collez le lien d'email de confirmation :</Text>
            <TextInput
                value={emailInput}
                onChangeText={handleEmailChange}
                placeholder="https://app.com/confirm?token=abc123..."
                style={styles.input}
                multiline={true}
            />

            {token && (
                <Text style={styles.tokenFound}>
                    ✓ Token détecté
                </Text>
            )}

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <Button 
                    title="Confirmer l'email" 
                    onPress={handleConfirm}
                    disabled={!token}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        width: '100%',
        padding: 12,
        marginBottom: 15,
        fontSize: 14,
        minHeight: 80,
        backgroundColor: '#fff',
    },
    tokenFound: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
});