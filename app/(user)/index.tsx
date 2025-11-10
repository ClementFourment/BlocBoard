import BlocList from '@/components/BlocList';
import SalleMap from '@/components/SalleMap';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Block } from '../../interfaces/Block';
import { supabase } from '../../lib/supabase';


export default function Home() {
  
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlocks();
    }, []);

    const fetchBlocks = async () => {
        const { data, error } = await supabase
            .from('blocks')
            .select('*')
            .order('date_ouverture', { ascending: false });

        if (error) {
            console.error(error);
            alert('Erreur lors de la récupération des blocs');
        } else {
            setBlocks(data || []);
        }
        setLoading(false);
    }
    
    
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6600" />
                <Text>Chargement des blocs...</Text>
            </View>
        );
    }

    return (
        
        <ScrollView style={styles.container}>
            <SalleMap onSelectMur={(mur) => console.log(mur)} />
            <BlocList blocks={blocks} />
        </ScrollView>
    );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111',
  },
  detail: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
