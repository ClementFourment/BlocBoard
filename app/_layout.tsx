import { fetchVersion, localVersion } from '@/constants/version';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';
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
    NavigationBar.setButtonStyleAsync('dark');



    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      router.replace('/(user)/(blocs)')
    }
  }, [session, loading, segments]);


  async function checkVersion() {
    const version = await fetchVersion();
    if (version.version == localVersion.version) {
      // version à jour
    }
    else {
      showUpdatePopup(version);
    }
  }

  function showUpdatePopup(version: any) {
    Alert.alert(
      "Mise à jour disponible",
      `Une nouvelle version (${version.version}) est disponible.`,
      [
        {
          text: "Mettre à jour",
          onPress: () => updateApp(version.url)
        },
      ],
      { cancelable: false }
    );
  }

  const updateApp = async (apkUrl: string) => {
    // try {
    //   const path = `${RNFS.DownloadDirectoryPath}/update.apk`;

    //   await RNFS.downloadFile({ fromUrl: apkUrl, toFile: path }).promise;

    //   IntentLauncherAndroid.startActivity({
    //     action: 'android.intent.action.VIEW',
    //     data: `file://${path}`,
    //     type: 'application/vnd.android.package-archive',
    //     flags: 0x10000000,
    //   });
    // } catch (e) {
    //   console.error("Erreur lors de la mise à jour :", e);
    // }
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

