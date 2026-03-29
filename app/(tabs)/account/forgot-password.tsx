// Affiche le formulaire de connextion et un lien vers mot de passe oublié
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function LoginScreen() {

    // peut rediriger vers l'écran mot de passe oublié
        

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Formulaire de réinitialisation du mot de passe</Text>
        </View>
    )
};


// import { useState } from 'react';
// import { View, ScrollView, StyleSheet, Text } from 'react-native';
// import { Link } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Container, TextInput, Button, ErrorAlert, Loading } from '../../components/index';
// import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/index';

// export default function ForgotPasswordScreen() {
//   const { forgotPassword, isLoading, error, clearError } = useAuth();
//   const [email, setEmail] = useState('');
//   const [sent, setSent] = useState(false);
//   const [errorMessage, setError] = useState<string | null>(null);

//   const handleForgotPassword = async () => {
//     if (!email) {
//       return;
//     }

//     try {
//       await forgotPassword(email);
//       setSent(true);
//     } catch (err) {
//       // Error handled by context
//     }
//   };

//   if (sent) {
//     return (
//       <Container>
//         <View style={styles.container}>
//           <Text style={[TYPOGRAPHY.title, { color: COLORS.primary, marginBottom: SPACING.lg }]}>
//             Email envoyé
//           </Text>
//           <Text style={[TYPOGRAPHY.body, { marginBottom: SPACING.lg }]}>
//             Vérifiez votre email pour réinitialiser votre mot de passe.
//           </Text>
//           <Link href="/(auth)/login" asChild>
//             <Button title="Retour à la connexion" />
//           </Link>
//         </View>
//       </Container>
//     );
//   }

//   return (
//     <Container>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={[TYPOGRAPHY.title, { color: COLORS.primary, marginBottom: SPACING.lg }]}>
//           Réinitialiser le mot de passe
//         </Text>

//         {error && <ErrorAlert type="error" message={error} onDismiss={() => setError(null)} />}

//         <TextInput
//           label="Email"
//           placeholder="votre@email.com"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           editable={!isLoading}
//         />

//         <Button
//           title={isLoading ? 'Envoi...' : 'Envoyer un lien'}
//           onPress={handleForgotPassword}
//           disabled={isLoading}
//           style={{ marginTop: SPACING.lg }}
//         />

//         <Link href="/(auth)/login" asChild>
//           <Button
//             title="Retour à la connexion"
//             variant="secondary"
//             style={{ marginTop: SPACING.md }}
//           />
//         </Link>

//         {isLoading && <Loading />}
//       </ScrollView>
//     </Container>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: SPACING.md,
//   },
// });
