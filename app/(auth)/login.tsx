// import { useState } from 'react';
// import { View, ScrollView, StyleSheet, Text } from 'react-native';
// import { Link } from 'expo-router';
// import { useAuth } from '../../context/AuthContext';
// import { Container, TextInput, Button, ErrorAlert, Loading } from '../../components/index';
// import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/theme';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: SPACING.md,
//   },
//   header: {
//     marginBottom: SPACING.xl,
//     alignItems: 'center',
//   },
//   title: {
//     ...TYPOGRAPHY.title,
//     color: COLORS.primary,
//   },
//   form: {
//     marginBottom: SPACING.lg,
//     gap: SPACING.md,
//   },
//   links: {
//     gap: SPACING.md,
//   },
// });

// export default function LoginScreen() {
//   const { login, isLoading, error, clearError } = useAuth();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     if (!email || !password) {
//       return;
//     }

//     try {
//       await login({ email, password });
//     } catch (err) {
//       // Error handled by context
//     }
//   };

//   return (
//     <Container>
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.title}>CESIZen</Text>
//         </View>

//         {error && <ErrorAlert type="error" message={error} onDismiss={clearError} />}

//         <View style={styles.form}>
//           <TextInput
//             label="Email"
//             placeholder="votre@email.com"
//             value={email}
//             onChangeText={setEmail}
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

//           <Button
//             title={isLoading ? 'Connexion...' : 'Connexion'}
//             onPress={handleLogin}
//             disabled={isLoading}
//           />
//         </View>

//         <View style={styles.links}>
//           <Link href="/(auth)/forgot-password" asChild>
//             <Button
//               title="Mot de passe oublié?"
//               variant="outline"
//               disabled={isLoading}
//             />
//           </Link>

//           <Link href="/(auth)/register" asChild>
//             <Button
//               title="Créer un compte"
//               variant="secondary"
//               disabled={isLoading}
//             />
//           </Link>
//         </View>

//         {isLoading && <Loading />}
//       </ScrollView>
//     </Container>
//   );
// }
