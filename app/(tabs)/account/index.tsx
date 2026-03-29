import { Redirect, useRouter } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";


export default function AccountScreen() {
    const router = useRouter();
    const { user } = useAuth();

    // Si pas connecté → redirige vers login
    if (!user) {
        router.replace("/account/login");
        return null; // ou un loader
    }

    // Va détecter si l'utilisateur est connecté ou pas, et le rediriger vers la page de login s'il ne l'est pas
    // Si non connecté --> redirection  vers login.tsx
    // const isLoggedIn = false;

    // if (!isLoggedIn) {
    //     return <Redirect href="/(auth)/login" />;
    // }

    // Si connecté --> affiche les blocs profil, CGU, faq 
    return (
        <View>
            <TouchableOpacity onPress={() => router.push("/account/profile")}>
                <Text>Consulter mon profil</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/account/cgu")}>
                <Text>Conditions générales</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/account/faq")}>
                <Text>FAQ</Text>
            </TouchableOpacity>
        </View>
    );
};