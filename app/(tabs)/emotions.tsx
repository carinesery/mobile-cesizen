import { View, Text } from 'react-native';
// import { Redirect } from 'expo-router';

export default function EmotionsScreen() {

    // const isLogin = false; // un state ici 

    // if (!isLogin) {
    //     return <Redirect href="(auth)/login" />;
    // }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Emotions (accès privé)</Text>
        </View>
    );
}