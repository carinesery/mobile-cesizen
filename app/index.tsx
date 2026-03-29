import { Redirect } from 'expo-router';

export default function Index() {

  // Donc je ne suis pas sûre d'avoir besoin de la logique des 3 premières lignes 
  const isLogin = false; 

  if(isLogin) {
    return <Redirect href="(tabs)" />;
  }
 
  return <Redirect href="/(tabs)" />;
}
