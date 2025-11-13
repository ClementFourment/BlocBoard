import { useAuth } from '@/contexts/AuthContext'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer'
import { useRouter } from 'expo-router'
import { Image, StyleSheet, Text, View } from 'react-native'

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { user, userInfos, avatarKey, fetchUserInfos } = useAuth()
  const router = useRouter()

  if (!userInfos) {
    console.log(userInfos)
    fetchUserInfos();
  }
  
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <View style={styles.header}>

        <View style={styles.avatar}>
          {userInfos?.photo_url ? (
            <Image key={avatarKey} source={{ uri: userInfos?.photo_url}} style={styles.avatarImage} />
          ) :
            <Text style={styles.avatarText}>
              {userInfos?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          }
        </View>


        <Text style={styles.email}>{user?.email}</Text>
        
      </View>

      <View style={styles.divider} />

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: 60,
    height: 60, 
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  profileButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  profileButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
})