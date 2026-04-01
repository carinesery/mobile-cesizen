import { View, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, SPACING, TYPOGRAPHY } from '@/constants';  


export const Footer = ({height, marginTop}: {height?: number, marginTop?: number}) => {
  return (
     <View style={[styles.footer, { height, marginTop }]}>
              <Text style={styles.footerText}>Une application propulsée par</Text>
              <Image
                source={require("../assets/logo-ministere.png")}
                style={{ width: 200, height: 60 }}
                contentFit='contain'
                accessibilityLabel='Logo du Ministère de la santé et de la prévention'
              />
            </View>
  )}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  footerText: {
    fontSize: 16,
    fontFamily: 'Nunito Sans',
    fontWeight: '500' as any,
    color: COLORS.text
  },
});
