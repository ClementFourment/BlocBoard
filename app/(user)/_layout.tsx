import CustomDrawerContent from '@/components/CustomDrawerContent'
import { Ionicons } from '@expo/vector-icons'
import { Drawer } from 'expo-router/drawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function TabsLayout() {
  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen
          name="(blocs)"
          options={{
            drawerLabel: 'Blocs',
            title: 'Les blocs',
            drawerIcon: () =>
                        <Ionicons name="apps-outline"
                            size={30}
                            color="black" />
          }}
        />
        <Drawer.Screen
          name="(classement)"
          options={{
            drawerLabel: 'Classement',
            title: 'Classement',
            drawerIcon: () =>
                        <Ionicons name="podium-outline"
                            size={30}
                            color="black" />
          }}
        />
        <Drawer.Screen
          name="(profile)"
          options={{
            drawerLabel: 'Profil',
            title: 'Mon Profil',
            drawerIcon: () =>
                        <Ionicons name="person-outline"
                            size={30}
                            color="black" />
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}