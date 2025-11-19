import SalleMapMini from "@/components/SalleMapMini";
import { COLOR_POINTS } from "@/constants/colorPoints";
import { COLOR_TRAD } from "@/constants/colorTrad";
import { supabase } from "@/lib/supabase";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ColorPicker from 'react-native-wheel-color-picker';





export default function AddBlock() {

    const [selectedLevel, setSelectedLevel] = useState(null);
    const [color, setColor] = useState<string | null>();
    
    const { selectedMurId } = useLocalSearchParams();
    const [image, setImage] = useState<string | null>(null);


    const pickImage = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission refusée", "Tu dois autoriser l'accès à la galerie pour choisir une photo.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              quality: 0.7,
            });

        
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            alert("Permission caméra refusée");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleValiderBloc = () => {
        
        if (color && selectedLevel && selectedMurId && image) {
            validerBloc(color, selectedLevel, selectedMurId, image);
        }
    }

    const validerBloc = async (color: string, selectedLevel: string, selectedMurId: string | string[], image: string) => {
        
        try {
            if (!color || !selectedLevel || !selectedMurId || !image) {
                Alert.alert("Erreur", "Tous les champs doivent être remplis !");
                return;
            }
            
            const formData = new FormData();
            const fileName = `image_${selectedMurId}_${Date.now()}.png`;
            
            formData.append('file', {
                name: fileName,
                uri: image,
                type: `image/png`,
            } as any);
            
            const { error } = await supabase.storage
                .from('walls')
                .upload(fileName, formData, {
                    upsert: true,
                    contentType: `image/png`
                });
    
            if (error) throw error;

            const { data } = supabase.storage
                .from('walls')
                .getPublicUrl(fileName);

            const publicUrl = data.publicUrl;

            await supabase
                .from('blocks')
                .insert({
                    colorLevel: selectedLevel,
                    colorBlock: color,
                    ouvreur: '',
                    actif: true,
                    points: COLOR_POINTS[selectedLevel],
                    murId: selectedMurId,
                    photo_url: `${publicUrl}?t=${Date.now()}`
                });

            router.back();
        } catch (error) {
            console.error("Erreur lors de la validation du bloc :", error);
            Alert.alert("Erreur", "Impossible d'ajouter le bloc. Réessaye.");
        }
    }

    return (
        
        <ScrollView style={styles.container}>

            <View style={{margin:40, backgroundColor: 'transparent', transform: 'scale(2)', display: 'flex', alignItems: 'center'}}>
                <SalleMapMini wall={Number(selectedMurId)} ></SalleMapMini>
            </View>

            <View style={styles.card}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Ajouter une photo
                </Text>

                {image ? (
                <Image source={{ uri: image }} style={styles.preview} />
                ) : (
                <View style={styles.emptyPreview}>
                    <Text style={{ color: "#999" }}>Aucune image</Text>
                </View>
                )}

                <View style={{ flexDirection: "row", gap: 10, marginTop: 15 }}>
                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>📁 Galerie</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.buttonText}>📸 Caméra</Text>
                </TouchableOpacity>
                </View>
            </View>

            <View style={styles.divider2} />

            <View>
                <Text style={styles.label}>Difficulté :</Text>

                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedLevel}
                        onValueChange={(value) => {
                            setSelectedLevel(value);
                        }}
                    >
                        <Picker.Item label="Sélectionner une couleur..." value={null} />

                        {Object.keys(COLOR_POINTS).map((color) => (
                            
                            <Picker.Item
                            key={color}
                            label={`${(COLOR_TRAD[color]).charAt(0).toUpperCase()+(COLOR_TRAD[color]).slice(1)} (${COLOR_POINTS[color]} pts)`}
                            value={color}
                            />
                        ))}

                    </Picker>
                </View>
            </View>

            <View style={styles.divider2} />

            <View>
                <Text style={styles.label}>Couleur :</Text>
                <View style={{ height: 300 }}>
                    <ColorPicker
                        onColorChange={c => setColor(c)}
                        onColorChangeComplete={c => console.log('Couleur finale:', c)}
                        thumbSize={30}
                        sliderSize={30}
                        noSnap={true}
                        row={false}
                    />
                </View>
            </View>

            <View style={styles.divider2} />

            <View style={{display: 'flex', alignItems: 'center'}}>
                <TouchableOpacity
                    style={[styles.buttonValidate]}
                    onPress={() => handleValiderBloc()}
                >
                    <Text style={styles.buttonText}>Ajouter le bloc</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider2} />
            <View style={styles.divider2} />
        </ScrollView>
    );
}
const styles = StyleSheet.create({
  
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
  preview: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginTop: 10,
  },
  emptyPreview: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginTop: 10,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    backgroundColor: "#41b93e",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  divider2: {
    width: '100%',
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: 15,
  },
  label: { fontWeight: "600", fontSize: 16, marginBottom: 6 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  buttonValidate: {
    backgroundColor: '#41b93eff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 30,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  }
});
