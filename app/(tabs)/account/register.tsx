import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function RegisterScreen() {

   // Formulaire d'inscription
        

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Inscription</Text>
        </View>
    )
};














// import { useState } from 'react';
// import { View, ScrollView, StyleSheet, Text } from 'react-native';
// import { Link } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Container, TextInput, Button, ErrorAlert, Loading } from '../../components/index';
// import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';

// const styles = StyleSheet.create({
//   container: {
//     paddingVertical: SPACING.lg,
//     paddingHorizontal: SPACING.md,
//   },
//   form: {
//     marginBottom: SPACING.lg,
//     gap: SPACING.md,
//   },
// });

// export default function RegisterScreen() {
//   const { register, isLoading, error, clearError } = useAuth();
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleRegister = async () => {
//     if (!username || !email || !password || !confirmPassword) {
//       return;
//     }

//     if (password !== confirmPassword) {
//       return;
//     }

//     try {
//       await register({
//         username,
//         email,
//         password,
//         confirmPassword,
//         termsConsent: true,
//         privacyConsent: true,
//       });
//     } catch (err) {
//       // Error handled by context
//     }
//   };

//   return (
//     <Container>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={[TYPOGRAPHY.title, { color: COLORS.primary, marginBottom: SPACING.lg }]}>
//           Créer un compte
//         </Text>

//         {error && <ErrorAlert type="error" message={error} onDismiss={clearError} />}

//         <View style={styles.form}>
//           <TextInput
//             label="Pseudo"
//             placeholder="john_doe"
//             value={username}
//             onChangeText={setUsername}
//             editable={!isLoading}
//           />

//           <TextInput
//             label="Email"
//             placeholder="votre@email.com"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             editable={!isLoading}
//           />

//           <TextInput
//             label="Mot de passe"
//             placeholder="••••••••"
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             editable={!isLoading}
//           />

//           <TextInput
//             label="Confirmer le mot de passe"
//             placeholder="••••••••"
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//             secureTextEntry
//             editable={!isLoading}
//           />

//           <Button
//             title={isLoading ? 'Inscription...' : 'S\'inscrire'}
//             onPress={handleRegister}
//             disabled={isLoading}
//           />
//         </View>

//         <Link href="/(auth)/login" asChild>
//           <Button
//             title="Déjà inscrit? Connexion"
//             variant="secondary"
//             disabled={isLoading}
//           />
//         </Link>

//         {isLoading && <Loading />}
//       </ScrollView>
//     </Container>
//   );
// }
