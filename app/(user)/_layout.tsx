import CustomDrawerContent from '@/components/CustomDrawerContent'
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
            title: 'Les blocs de BL1',
          }}
        />
        <Drawer.Screen
          name="(profile)"
          options={{
            drawerLabel: 'Profil',
            title: 'Mon Profil',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}