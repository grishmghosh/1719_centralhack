import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StatusBarManager, { StatusBarThemes } from '@/components/StatusBarManager';
import { QRScannerProvider } from '@/contexts/QRScannerContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    // Inter fonts for body text (better readability)
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    
    // Outfit fonts for headings and UI elements (brand personality)
    'Outfit-Light': Outfit_300Light,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-Medium': Outfit_500Medium,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QRScannerProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="account-settings" />
          <Stack.Screen name="satronis-demo" />
          <Stack.Screen name="todays-health" />
          <Stack.Screen name="health-alerts" />
          <Stack.Screen name="my-conditions" />
          <Stack.Screen name="emergency-profile" />
          <Stack.Screen name="family-profile/[id]" />
          <Stack.Screen name="family-privacy-settings" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBarManager {...StatusBarThemes.light} />
      </QRScannerProvider>
    </SafeAreaProvider>
  );
}