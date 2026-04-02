import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Mon compte" }} />
            <Stack.Screen name="profile" options={{ headerTitle: "Profil" }} />
            <Stack.Screen name="profile-edit" options={{ headerTitle: "Modifier le profil" }} />
            <Stack.Screen name="update-password" options={{ headerTitle: "Modifier le mot de passe" }} />
            <Stack.Screen name="cgu" options={{ headerTitle: "Conditions générales" }} />
            <Stack.Screen name="privacy" options={{ headerTitle: "Politique de confidentialité" }} />
            <Stack.Screen name="faq" options={{ headerTitle: "FAQ" }} />
        </Stack>
    );
}