import { fetchVersion, localVersion } from '@/constants/version';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';



function RootLayoutNav() {
  const { session, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()
  const insets = useSafeAreaInsets();


  
  useEffect(() => {

    checkVersion();

    // SystemUI.setBackgroundColorAsync('#ffffff');
    // NavigationBar.setBackgroundColorAsync('#ffffff');
    if (Platform.OS === 'android') {
      NavigationBar.setButtonStyleAsync('dark');
    }

    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      router.replace('/(user)/(blocs)')
    }
  }, [session, loading, segments]);


  async function checkVersion() {
    try {
      const version = await fetchVersion();
      
      if (version.version !== localVersion.version) {
        showUpdatePopup(version);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de version:", error);
    }
  }

  function showUpdatePopup(version: any) {
    Alert.alert(
      "Mise à jour disponible",
      `Une nouvelle version (${version.version}) est disponible.`,
      [
        {
          text: "Mettre à jour",
          onPress: () => downloadUpdate(version.url)
        },
      ],
      { cancelable: false }
    );
  }

  const downloadUpdate = async (apkUrl: string) => {
    try {
      const canOpen = await Linking.canOpenURL(apkUrl);
      
      if (canOpen) {
        Alert.alert(
          "Téléchargement",
          "Le téléchargement va s'ouvrir dans votre navigateur. Une fois terminé, installez le fichier APK.",
          [
            {
              text: "OK",
              onPress: () => Linking.openURL(apkUrl)
            }
          ]
        );
      } else {
        Alert.alert("Erreur", "Impossible d'ouvrir le lien de téléchargement.");
      }
    } catch (e) {
      console.error("Erreur lors de l'ouverture du lien:", e);
      Alert.alert("Erreur", "Une erreur est survenue. Veuillez télécharger manuellement depuis: " + apkUrl);
    }
  };
  


  if (loading) {
    return null
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </GestureHandlerRootView>
  )
}

