import { Redirect } from 'expo-router';

export default function Index() {

  return <Redirect href="/(tabs)" />;
}

// app/index.tsx
// import React, { useEffect, useState } from "react";
// import { View, Image, StyleSheet } from "react-native";
// import * as SplashScreen from "expo-splash-screen";
// import { Redirect, router } from "expo-router";

// SplashScreen.preventAutoHideAsync(); // empêche le splash natif de disparaître

// export default function Splash() {
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const prepare = async () => {
//       try {
//         // ici tu peux charger des fonts, données API, etc.
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         setIsReady(true);
//         await SplashScreen.hideAsync(); // cacher splash natif
//         router.replace("/(tabs)"); // naviguer vers le hub du compte
//       }
//     };

//     prepare();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require("../assets/screen-splash-cesizen.png")}
//         style={styles.logo}
//         resizeMode="cover"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff", // même couleur que ton splash statique
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logo: {
//     width: 200,
//     height: 200,
//   },
// });
