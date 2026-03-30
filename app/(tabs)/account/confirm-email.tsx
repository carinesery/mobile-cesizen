import * as Linking from 'expo-linking';
import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services';

export default function ConfirmEmailScreen() {
    const router = useRouter();
    const [token, setToken] = useState('');

    //   useEffect(() => {
    //     const getInitialUrl = async () => {
    //       const url = await Linking.getInitialURL();
    //       if (url) {
    //         const { queryParams } = Linking.parse(url);
    //         if(queryParams) {
    //             const token = queryParams.token
    //               ? Array.isArray(queryParams.token)
    //                 ? queryParams.token[0]
    //                 : queryParams.token
    //               : undefined;
    //             if (token) {
    //               try {
    //                 await authService.confirmEmail(token);
    //                 router.replace("/account"); // navigation après confirmation
    //               } catch (error: any) {
    //                 console.log(error.message);
    //                 // tu peux router vers un écran d'erreur ou afficher un message
    //               }
    //             }
    //         }
    //       }
    //     };
    //     getInitialUrl();
    //   }, []);

    const handleConfirm = async () => {
        try {
            await authService.confirmEmail(token);
            router.replace("/account");
        } catch (error: any) {
            console.log(error.message);
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                value={token}
                onChangeText={setToken}
                placeholder="Colle le token ici"
                style={{ borderWidth: 1, width: '80%', padding: 8, marginBottom: 10 }}
            />
            <Button title="Confirmer l'email" onPress={handleConfirm} />
        </View>
    );

    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //       {/* <ActivityIndicator size="large" /> */}
    //       <Text>Confirmation de l'email en cours...</Text>
    //     </View>
    //   );
}