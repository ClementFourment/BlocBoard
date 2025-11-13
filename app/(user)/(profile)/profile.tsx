import { useAuth } from '@/contexts/AuthContext';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, userInfos, signOut, avatarKey, refreshAvatar, fetchUserInfos } = useAuth()

  useFocusEffect(
    useCallback(() => {
      fetchUserInfos();
    }, [])
  );

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    )
  }
  const handleUpdate = () => {
    // navigation.navigate('Details')
    router.push('/updateProfile');
  }


    
  return (
    <ScrollView style={styles.container}>

      <View style={styles.card}>

        <View style={styles.avatar}>
          {userInfos?.photo_url ? (
            <Image key={avatarKey} source={{ uri: userInfos?.photo_url}} style={styles.avatarImage} />
          ) :
            <Text style={styles.avatarText}>
              {userInfos?.email?.charAt(0).toUpperCase() || '?'}
            </Text>
          }
        </View>
        
        <Text style={styles.email}>{userInfos?.email}</Text>
        <Text style={styles.label}>Email</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pseudo</Text>
          <Text style={styles.infoValue}>{userInfos?.pseudo ? userInfos?.pseudo : '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Taille</Text>
          <Text style={styles.infoValue}>{userInfos?.height ? userInfos?.height + 'cm' : '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Envergure</Text>
          <Text style={styles.infoValue}>{userInfos?.wingspan ? userInfos?.wingspan + 'cm' : '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Poids</Text>
          <Text style={styles.infoValue}>{userInfos?.weight ? userInfos?.weight + 'kg' : '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date de naissance</Text>
          <Text style={styles.infoValue}>
            {userInfos?.birthday ? new Date(userInfos.birthday).toLocaleDateString('fr-FR') : '-'}
          </Text>
        </View>


        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>ID utilisateur</Text>
          <Text style={styles.infoValue}>{userInfos?.id.slice(0, 8)}...</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Créé le</Text>
          <Text style={styles.infoValue}>
            {userInfos?.created_at ? new Date(userInfos.created_at).toLocaleDateString('fr-FR') : '-'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Visibilité du profil</Text>
          <Text style={styles.infoValue}>
            {userInfos?.visible ? 'Visible' : 'Invisible'}
          </Text>
        </View>
        
      </View>


        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.signOutText}>Modifier le profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <View style={styles.divider2} />
        <View style={styles.divider2} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarImage: {
    width: 80,
    height: 80, 
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 15,
  },
  divider2: {
    width: '100%',
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#41b93eff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})