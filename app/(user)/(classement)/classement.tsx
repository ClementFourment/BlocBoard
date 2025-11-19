import { supabase } from '@/lib/supabase';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface infos {
    id: string;
    pseudo: string;
    email: string;
    photo_url: string;
    visible: boolean;
    points: number;
}

export default function Classement() {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<infos[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);
    useFocusEffect(
        useCallback(() => {
          fetchUsers();
        }, [])
      );

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('users')
            .select(`
                id,
                email,
                pseudo,
                photo_url,
                visible,
                validateBlocks (
                    blocks ( 
                        points 
                    )
                )
            `);
    
        if (error) {
            console.error(error);
            alert('Erreur lors de la récupération des utilisateurs');
        } else {
            const usersWithPoints = data.map(user => ({
                id: user.id,
                pseudo: user.pseudo,
                email: user.email,
                photo_url: user.photo_url,
                visible: user.visible,
                points: user.validateBlocks?.reduce(
                    (sum: number, vb: any) => sum + (vb.blocks?.points || 0),
                0
                ) || 0
            }));
            
            usersWithPoints.sort((a, b) => b.points - a.points);
            setUsers(usersWithPoints.filter(user => user.visible));
        }
        setLoading(false);
    }





    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6600" />
                <Text>Chargement du classement...</Text>
            </View>
        );
    }
    return (
        
        <ScrollView style={styles.listContainer}>

            {users.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.card,
                            index === 0 ? styles.cardFirst : {}, 
                            index === users.length - 1 ? styles.cardLast : {}
                        ]}
                    >


                        <View style={styles.imageContainer}>
                            {item.photo_url ? (
                                <Image
                                    source={{ uri: item.photo_url }}
                                    style={[styles.image]}
                                />
                            ) : (
                                <View
                                    style={[
                                    styles.image,
                                    {
                                        backgroundColor: '#eee',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    ]}
                                >
                                </View>
                            )}
                        </View>
                        

                        <View style={styles.info}>

                            <View>
                                <Text style={styles.pseudo}>{
                                (item.pseudo ? item.pseudo : item.email).length > 20
                                ?  (item.pseudo ? item.pseudo : item.email).slice(0, 20)+"..."
                                : (item.pseudo ? item.pseudo : item.email)

                                }</Text>
                            </View>
                            
                            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                    <Text style={styles.detailPoints}>{index+1}</Text>
                                    <Text style={styles.detailPtsBis}>{index ? 'ème' : 'er'}</Text>
                                </View>
                                <View style={{display: 'flex', flexDirection: 'row'}}>
                                    <Text style={styles.detailPoints}>{item.points}</Text>
                                    <Text style={styles.detailPts}>pts</Text>
                                </View>
                            </View>
                        </View>

                        


                </TouchableOpacity>
            )})}

        </ScrollView>

    );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 24,
    flex: 1,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 2,
    height: 68,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    padding: 4
  },
  cardFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%'
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 4,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '80%',
    backgroundColor: 'transparent',
    padding: 12,
  },
  detailPoints: {
    fontSize: 25,
    fontWeight: '800',
    opacity: 1,
  },
  detailPts: {
    fontWeight: '800',
    opacity: 1,
    marginTop: 10
  },
  detailPtsBis: {
    fontWeight: '800',
    opacity: 1,
    marginTop: 2
  },
  pseudo: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});