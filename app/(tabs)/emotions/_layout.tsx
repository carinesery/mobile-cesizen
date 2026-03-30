import { Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function EmotionsLayout() {
    return (
        <Stack
            screenOptions={{
                headerTintColor: COLORS.primary,
            }}
        >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
                name="new-entry"
                options={{
                    title: 'Nouvelle entrée',
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}
