import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';

export default function AuthLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Retour",
        headerRight: () => (
          <TouchableOpacity onPress={() => router.back()} style={{ paddingLeft: 15 }}>
            <Text style={{ fontSize: 16, color: '#007AFF' }}>Fermer ✕</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="login" options={{ title: "Connexion" }} />
      <Stack.Screen name="register" options={{ title: "Créer un compte" }} />
      <Stack.Screen name="confirm-email" options={{ title: "Confirmer votre email" }} />
    </Stack>
  );
}
