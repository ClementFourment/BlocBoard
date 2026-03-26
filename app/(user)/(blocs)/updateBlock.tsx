import SalleMapMini from "@/components/SalleMapMini";
import { COLOR_LEVEL } from "@/constants/colorLevel";
import { COLOR_POINTS } from "@/constants/colorPoints";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ColorPicker from 'react-native-wheel-color-picker';





export default function UpdateBlockScreen() {

    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>();
    const { selectedMurId, selectedBlockId } = useLocalSearchParams();
    const [uploading, setUploading] = useState(false);

    
    useEffect(() => {
        fetchBlockInfos();
    }, []);
    
    const fetchBlockInfos = async () => {
        try {
            const { data, error } = await supabase
                .from('blocks')
                .select('*')
                .eq('id', selectedBlockId)
                .single();

            if (error) {
                console.error("Erreur lors de la recupération des infos du bloc :", error);
                Alert.alert("Erreur", "Impossible de récupérer les infos du bloc. Réessaye.");
            }
            else {
                setSelectedLevel(data.colorLevel);
                setColor(data.colorBlock);
            }

        } catch (error) {
            console.error("Erreur lors de la recupération des infos du bloc :", error);
            Alert.alert("Erreur", "Impossible de récupérer les infos du bloc. Réessaye.");
        }
    }
    const handleUpdateBloc = () => {
        
        if (color && selectedLevel && selectedMurId && selectedBlockId) {
            updateBloc(color, selectedLevel, selectedMurId, selectedBlockId);
        }
        else {
            let errors = [];
            if (!color) {
                errors.push('couleur')
            }
            if (!selectedLevel) {
                errors.push('difficulté')
            }
            if (!selectedMurId) {
                errors.push('mur')
            }

            Alert.alert("Erreur", "Champs manquants : " + errors.join(', ')) + ".";
            return;
        }
    }

    const updateBloc = async (color: string, selectedLevel: string, selectedMurId: string | string[], selectedBlockId: string | string[]) => {
        
        try {
            if (!color || !selectedLevel || !selectedMurId || !selectedBlockId) {
                Alert.alert("Erreur", "Tous les champs doivent être remplis !");
                return;
            }
            
            setUploading(true);

            
            await supabase
                .from('blocks')
                .update({
                    colorLevel: selectedLevel,
                    colorBlock: color,
                    points: COLOR_POINTS[selectedLevel],
                })
                .eq('id', selectedBlockId);
            router.back();

        } catch (error) {
            console.error("Erreur lors de la validation du bloc :", error);
            Alert.alert("Erreur", "Impossible d'ajouter le bloc. Réessaye.");
        }
        finally {
            setUploading(false);
        }
    }

    return (
        
        <ScrollView style={styles.container}>

            {uploading && (
                <View style={[styles.loaderOverlay]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
    
            

            <View style={styles.card}>

                <View style={{margin:40, backgroundColor: 'transparent', transform: 'scale(2)', display: 'flex', alignItems: 'center'}}>
                    <SalleMapMini wall={Number(selectedMurId)} ></SalleMapMini>
                </View>

                <View style={styles.divider} />
                <View style={styles.divider2} />


                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                    Selectionner une difficulté
                </Text>
                <View style={styles.divider2} />

                <View style={styles.colorLevelPicker}>

                    {Object.keys(COLOR_POINTS).map((color, i) => (
                        
                        <Pressable
                            key={color}
                            onPress={() => {
                                setSelectedLevel(color);
                                console.log(i)
                            }}
                        >
                            <View
                                style={{
                                width: 30,
                                height: 30,
                                borderWidth: 2,
                                borderRadius: 4,
                                borderColor: COLOR_LEVEL[color],
                                marginRight: 10,
                                backgroundColor: selectedLevel === color ? COLOR_LEVEL[color] : "transparent"
                                }}
                            />
                        </Pressable>
                    ))}
                </View>
                
                <View style={styles.divider2} />
                <View style={styles.divider} />
                <View style={styles.divider2} />

                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                    Couleur des prises
                </Text>
                <View style={styles.divider2} />
                
                    <View style={{ height: 300 }}>
                        <ColorPicker
                            onColorChange={c => setColor(c)}
                            thumbSize={30}
                            sliderSize={30}
                            noSnap={true}
                            row={false}
                            color={""+color}
                        />
                    </View>


            </View>


            <View style={{display: 'flex', alignItems: 'center'}}>
                <TouchableOpacity
                    style={[styles.buttonValidate]}
                    onPress={() => handleUpdateBloc()}
                >
                    <Text style={styles.buttonText}>Modifier le bloc</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.divider2} />
            <View style={styles.divider2} />
        </ScrollView>
    );
}
const styles = StyleSheet.create({

  colorLevelPicker: {
    display: 'flex',
    flexDirection: 'row',
  },
  loaderOverlay:{
    ...StyleSheet.absoluteFillObject, // couvre tout l'écran
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    zIndex: 9999,
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
