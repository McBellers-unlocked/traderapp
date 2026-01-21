import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '@/lib/stores';

import '../global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Meta Pixel initialization for web
function initMetaPixel() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  // Check if already loaded
  if ((window as any).fbq) return;

  // Create and inject the Meta Pixel script
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1201348941656566');
    fbq('track', 'PageView');
  `;
  document.head.appendChild(script);
}

export default function RootLayout() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initialize();
      await SplashScreen.hideAsync();
    };
    init();

    // Initialize Meta Pixel on web
    initMetaPixel();
  }, [initialize]);

  if (isLoading) {
    return null; // Splash screen is still visible
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F8FAFC' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="lesson/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}
