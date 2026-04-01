// Ma nav mobile ici : Home, articles, emotions, account 

import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.neutral.darkGray,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="articles"
                options={{
                    title: "Articles",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen 
            name="emotions" 
            options={{ title: "Émotions", 
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="happy-outline" color={color} size={size} />
            ),
            }} />
            <Tabs.Screen 
            name="account" options={{ headerShown: false, 
            title: "Compte",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" color={color} size={size} />
            ),
            }} />
        </Tabs>
    );
}

