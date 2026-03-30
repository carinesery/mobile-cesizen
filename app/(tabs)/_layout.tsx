// Ma nav mobile ici : Home, articles, emotions, account 

import { Tabs } from 'expo-router';
// import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
            }}>
            <Tabs.Screen name="index" options={{ title: "Accueil" }} />
            <Tabs.Screen name="articles" options={{ title: "Articles", headerShown: false }} />
            <Tabs.Screen name="emotions" options={{ title: "Émotions", headerShown: false }} />
            <Tabs.Screen name="account" options={{ headerShown: false, title: "Compte" }} />
        </Tabs>
    );
}

