import { Stack } from "expo-router";

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerTitle: "Mon compte" }} />
            <Stack.Screen name="login" options={{ headerTitle: "Se connecter" }} />
            <Stack.Screen name="confirm-email" options={{ headerTitle: "Confirmer mon email" }} />
            <Stack.Screen name="forgot-password" options={{ headerTitle: "Mot de passe oublié" }} />
            <Stack.Screen name="update-password" options={{ headerTitle: "Réinitialiser le mot de passe" }} />
            <Stack.Screen name="profile" options={{ headerTitle: "Profil" }} />
            <Stack.Screen name="profile-edit" options={{ headerTitle: "Modifier le profil" }} />
            <Stack.Screen name="cgu" options={{ headerTitle: "Conditions générales" }} />
            <Stack.Screen name="privacy" options={{ headerTitle: "Politique de confidentialité" }} />
            <Stack.Screen name="faq" options={{ headerTitle: "FAQ" }} />
            <Stack.Screen name="register" options={{ headerTitle: "S'inscrire" }} />
            <Stack.Screen name="legals" options={{ headerTitle: "Mentions légales" }} />
            {/* <Stack.Screen name="reset-password" options={{ headerTitle: "Réinitialiser le mot de passe" }} /> */}


        </Stack>
    );
}