
import { AuthProvider } from '@/context/AuthContext';
import { MoodProvider } from '@/context/MoodContext';
import { ArticleProvider } from '@/context/ArticleContext';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JustSans-Regular': require('../assets/fonts/JustSans-Regular.otf'),
    'JustSans-ExBold': require('../assets/fonts/JustSans-ExBold.otf'),
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <MoodProvider>
        <ArticleProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false, presentation: 'modal' }} />
          </Stack>
        </ArticleProvider>
      </MoodProvider>
    </AuthProvider>
  )
}


{/* // import { useEffect } from 'react';
// import { Stack, useRouter, useSegments } from 'expo-router';
// import { AuthProvider, useAuth } from '../context/AuthContext';
// // import { ProfileProvider } from '../context/ProfileContext';
// // import { ArticlesProvider } from '../context/ArticlesContext';
// // import { MoodProvider } from '../context/MoodContext';
// // import { StatsProvider } from '../context/index';
// import { initializeAPI } from '../services/index';

// // Initialize API on app start
// initializeAPI();

// function RootLayoutNav() { */}
//   const { isAuthenticated, isLoading } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     if (isLoading) return;

//     const inAuthGroup = segments[0] === '(auth)';
//     const inPublicGroup = segments[0] === '(public)';
//     const inProtectedGroup = segments[0] === '(protected)';

//     // Si pas authentifié et pas en auth/public → aller sur public
//     if (!isAuthenticated && !inAuthGroup && !inPublicGroup) {
//       router.replace('/(public)/home');
//     }
//     // Si authentifié et en auth → aller sur protected
//     else if (isAuthenticated && inAuthGroup) {
//       router.replace('/(protected)/home');
//     }
//     // Si pas authentifié et en protected → aller sur public
//     else if (!isAuthenticated && inProtectedGroup) {
//       router.replace('/(public)/home');
//     }
//   }, [isAuthenticated, segments, isLoading]);

//   if (isLoading) {
//     return (
//       <Stack>
//         <Stack.Screen name="(public)" options={{ headerShown: false }} />
//       </Stack>
//     );
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(public)" options={{ headerShown: false }} />
//       <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//       {isAuthenticated && (
//         <Stack.Screen name="(protected)" options={{ headerShown: false }} />
//       )}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (
//       <RootLayoutNav />
//   );
// }
