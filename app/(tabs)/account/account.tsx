import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function AccountScreen() {

    // const isLoggedIn = false;

    // if (!isLoggedIn) {
    //     return <Redirect href="/(auth)/login" />;
    // }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Mon compte (vous allez pouvoir vous connecter, gérer vos informations personnelles, etc.)</Text>
        </View>
    )
};