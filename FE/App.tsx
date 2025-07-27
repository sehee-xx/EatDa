// App.tsx

import React, { useCallback, useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import SplashScreenVideo from "./src/screens/SplashScreen";

// prevent auto‑hide at cold start
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    AlfaSlabOne: require("./assets/fonts/AlfaSlabOneRegular.ttf"),
  });

  // 1️⃣ When fonts are loaded (or error), mark app ready
  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppIsReady(true);
    }
    const timer = setTimeout(() => setAppIsReady(true), 5000);
    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError]);

  // 2️⃣ As soon as appIsReady, hide the splash
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "blue",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            textAlign: "center",
            padding: 20,
          }}
        >
          Loading Fonts...{"\n"}
          Loaded: {fontsLoaded ? "YES" : "NO"}
          {"\n"}
          Error: {fontError ? "YES" : "NO"}
        </Text>
      </View>
    );
  }

  // 3️⃣ Now we’re ready and splash is hidden—show the video
  if (showVideo) {
    return <SplashScreenVideo onFinish={() => setShowVideo(false)} />;
  }

  // 4️⃣ Video done, show your app
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </View>
  );
}
