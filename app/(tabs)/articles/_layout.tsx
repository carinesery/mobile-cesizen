// Ma nav mobile ici : Home, articles, emotions, account 

import { Stack } from 'expo-router';
// import { MaterialIcons } from '@expo/vector-icons';
// import { COLORS } from '../../constants/theme';

export default function ArticlesStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Articles"
                }} />
            <Stack.Screen
                name="[slug]"
                options={{
                    title: "Article",
                    headerBackTitle: "Retour"
                }}
            />

        </Stack>
    );
}

