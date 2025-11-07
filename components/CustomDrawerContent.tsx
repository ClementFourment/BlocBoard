import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function CustomDrawerContent(props: any) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.title}>🧗‍♂️ BlocBoard</Text>
      </View>
      <DrawerItem label="Accueil" onPress={() => router.push('/')} />
      <DrawerItem label="Déconnexion" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
