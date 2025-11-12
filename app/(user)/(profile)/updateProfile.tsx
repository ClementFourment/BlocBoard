import { useAuth } from '@/contexts/AuthContext';
import { Users } from '@/interfaces/Users';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function UpdateProfileScreen() {
  const { user } = useAuth();

  const [userInfos, setUserInfos] = useState<Users>();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    pseudo: '',
    height: '',
    email: '',
    wingspan: '',
    weight: '',
    birthday: new Date(),
    visible: true
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (userInfos) {
      setFormData({
        pseudo: userInfos.pseudo || '',
        height: userInfos.height?.toString() || '',
        email: userInfos.email || '',
        wingspan: userInfos.wingspan?.toString() || '',
        weight: userInfos.weight?.toString() || '',
        birthday: userInfos.birthday ? new Date(userInfos.birthday) : new Date(),
        visible: userInfos.visible,
      });
    }
  }, [userInfos]);

  useEffect(() => {
    fetchUserInfos();
  }, []);

  const fetchUserInfos = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (error) {
      console.error(error);
      alert("Erreur lors de la récupération des informations de l'utilisateur");
    } else {
      setUserInfos(data || undefined);
    }
    setLoading(false);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setFormData({ ...formData, birthday: selectedDate });
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          pseudo: formData.pseudo,
          height: parseFloat(formData.height),
          wingspan: parseFloat(formData.wingspan),
          weight: parseFloat(formData.weight),
          birthday: formData.birthday.toISOString(),
          visible: formData.visible,
        })
        .eq('id', user?.id);

      if (error) throw error;

      
      await fetchUserInfos();
      router.back();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour.');
    }
  };

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  
  const pickImage = async () => {
    console.log('pickImage')
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // carré
      quality: 0.7,
    });
    // Demande la permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission refusée", "Tu dois autoriser l'accès à la galerie pour choisir une photo.");
      return;
    }
    
    if (!result.canceled) {

      console.log("Image sélectionnée :", result.assets[0].uri);
      setAvatarUri(result.assets[0].uri); 
    }
  }





  if (loading) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    
    <KeyboardAwareScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      enableOnAndroid={true}
      extraScrollHeight={20}
      keyboardOpeningTime={0}
    >
      

      <ScrollView style={styles.container}>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={{ marginLeft: 8, fontSize: 16 }}>Retour</Text>
        </TouchableOpacity>
      
        <View style={styles.card}>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => {pickImage}}>
            <Ionicons style={styles.pencil} name="pencil-sharp" size={24} color="black" />

            <View style={styles.avatar}>
              
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
              ) : (
                <Text style={styles.avatarText}>
                  {userInfos?.email?.charAt(0).toUpperCase() || '?'}
                </Text>
              )}
            </View>
            
          </TouchableOpacity>

          <Text style={styles.email}>{userInfos?.email}</Text>
          <Text style={styles.label}>Email</Text>
          <View style={styles.divider} />

          {/* Pseudo */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pseudo</Text>
            <TextInput
              style={styles.infoValue}
              value={formData.pseudo}
              onChangeText={(text) => handleChange('pseudo', text)}
              placeholder="Pseudo"
            />
          </View>

          {/* Taille, Envergure, Poids */}
          {['height', 'wingspan', 'weight'].map((field) => (
            <View key={field} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{field === 'height' ? 'Taille' : field === 'wingspan' ? 'Envergure' : 'Poids'}</Text>
              <TextInput
                style={styles.infoValue}
                value={formData[field as keyof typeof formData].toString()}
                onChangeText={(text) => handleChange(field as keyof typeof formData, text)}
                placeholder={field === 'height' ? 'Taille' : field === 'wingspan' ? 'Envergure' : 'Poids'}
                keyboardType="numeric"
                maxLength={3} 
              />
              <Text style={styles.infoInsideInput}>{field === 'height' ? 'cm' : field === 'wingspan' ? 'cm' : 'kg'}</Text>
            </View>
          ))}

          {/* Date de naissance */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de naissance</Text>
            <TouchableOpacity
              style={[styles.infoValue, { justifyContent: 'center' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formData.birthday.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={formData.birthday}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Visibilité du profil */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Visibilité du profil</Text>
            <Switch
              style={[styles.infoValue]}
              value={formData.visible}
              onValueChange={(value) => setFormData({ ...formData, visible: value })}
            />
              
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={formData.birthday}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.signOutText}>Valider</Text>
        </TouchableOpacity>

        <View style={styles.divider2} />
        <View style={styles.divider2} />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {},
  pencil: {
    position: 'absolute',
    left: 50,
    top: 50,
    zIndex: 100,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 50,
  },
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10},
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
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  email: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  label: { fontSize: 14, color: '#666', marginBottom: 20 },
  divider: { width: '100%', height: 1, backgroundColor: '#e0e0e0', marginVertical: 15 },
  divider2: { width: '100%', height: 1, backgroundColor: 'transparent', marginVertical: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoLabel: { flex: 1, fontSize: 14, color: '#666' },
  infoValue: { flex: 2, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, fontWeight: '500' },
  updateButton: { backgroundColor: '#41b93eff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  signOutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  infoInsideInput: {
    position: 'absolute',
    right: 10,
    opacity: 0.4
  }
});
