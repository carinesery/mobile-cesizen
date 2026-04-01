import { router } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Footer } from '@/components/Footer';
;



export default function Index() {

  const redirectToHome = () => {
    setTimeout(() => {
      // Redirige vers la page d'accueil après 2 secondes
      router.replace('/(tabs)');
    }, 4000);
  }

  redirectToHome();

  return (
    <LinearGradient
      colors={['#f3e8FF', '#F1FDFB']}
      style={{ flex: 1 }}
    >
      <View style={styles.screen}>
        <View style={styles.centerContent}>
          <Image
            source={require("../assets/logo-screen-splash.png")}
            style={styles.logo}
            contentFit='contain'
            accessibilityLabel='Logo CESIZen'
          />
          <Text style={styles.titleApp}>CESIZen</Text>
          <Text style={styles.slogan}>Prenez soin de votre santé mentale</Text>


        </View>
        <Footer height={160} marginTop={24}/>
      </View>
    </LinearGradient>

  )

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    flex: 9,
    paddingTop: SPACING.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  logo: {
    width: 120, 
    height: 120,
   
  },
  titleApp: {
    ...TYPOGRAPHY.titleApp, 
    color: COLORS.primary 
  },
  slogan: {
    ...TYPOGRAPHY.subtitle,
     fontFamily: 'Inter',
    color: COLORS.accent,
    width: 200,
   textAlign: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  footerText: {
    ...TYPOGRAPHY.small,
    color: COLORS.textLight,
  }
}
);