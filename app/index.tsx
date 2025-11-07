import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import BlocList from '../components/BlocList';
import SalleMap from '../components/SalleMap';
import { Block } from '../interfaces/Block';
import { supabase } from '../lib/supabase';


export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
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
    }
    catch(e: any) {
        console.error(e);
    }
    finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BlocBoard - Boulder Line</Text>
      <SalleMap />  
      <BlocList blocks={blocks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
