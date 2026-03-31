import { Stack } from 'expo-router';
import { COLORS } from '@/constants/theme';

export default function EmotionsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: true, title: "Tracker d'émotions" }} />
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
