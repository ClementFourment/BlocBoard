import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

function RootLayoutNav() {
  const { session, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()
  const insets = useSafeAreaInsets();

  useEffect(() => {

    // SystemUI.setBackgroundColorAsync('#ffffff');
    // NavigationBar.setBackgroundColorAsync('#ffffff');
    NavigationBar.setButtonStyleAsync('dark');



    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      // Rediriger vers login si pas connecté
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      // Rediriger vers l'app si connecté
      router.replace('/(user)')
    }
  }, [session, loading, segments])

  if (loading) {
    return null // ou un écran de chargement
  }


  return (
    <SafeAreaProvider style={[{ paddingBottom: insets.bottom || 20 }]}>
      <Stack screenOptions={
        { 
          headerShown: false,
          statusBarStyle: 'dark',
          
        }
      }>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(user)" />
      </Stack>
    </SafeAreaProvider>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  )
}

