import BlocList from '@/components/BlocList';
import SalleMap from '@/components/SalleMap';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Block } from '../../../interfaces/Block';
import { supabase } from '../../../lib/supabase';

export default function Home() {
  
    const [blocListKey, setBlocListKey] = useState<number>(0);
    const [selectedFilter, setSelectedFilter] = useState<number | null>(0);
  
    const [selectedMurId, setSelectedMurId] = useState<string | null>(null);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [selectedBlocks, changeBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingBlockList, setLoadingBlockList] = useState(true);


    const reloadBlocList = () => {
      setLoadingBlockList(true);
      setBlocListKey(blocListKey + 1);
    };

    useEffect(() => {
        fetchBlocks()
        // .then(
        //   () => setLoadingBlockList(false)
        // );
    }, []);

    useFocusEffect(
      useCallback(() => {
        fetchBlocks();
      }, [])
    );

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
    




    useEffect(() => {
      
      setLoadingBlockList(true);
      const task = setTimeout(() => {
        if (selectedMurId === null || selectedMurId =='0') {
          changeBlocks(blocks);
        } 
        else {
          const newBlocs = blocks.filter((bloc) => bloc.murId.toString() === selectedMurId);
          changeBlocks(newBlocs);
        }
        setLoadingBlockList(false);
      }, 0);
      return () => clearTimeout(task);
    }, [selectedMurId, blocks, selectedFilter]);
    





    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ff6600" />
                <Text>Chargement des blocs...</Text>
            </View>
        );
    }





    const filters = [
      'Tous les blocs',
      'Mes projets',
      'Mes blocs validés'
    ];


    return (
        
        <ScrollView style={styles.container}>

          <SalleMap onSelectMur={(mur) => {setLoadingBlockList(true); setSelectedMurId(mur); }} />

          {/* Filtre */}
          {(
            <>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
    
                {Object.keys(filters).map((filter, i) => (
                  <Pressable
                    key={filter}
                    onPress={() => {
                      if (i != selectedFilter) {
                        setLoadingBlockList(true); 
                        setSelectedFilter(i);
                        if (i==0) {
                          reloadBlocList();
                        }
                      }
                    }}
                  >
                    <View style={{marginRight: 10, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                      <View
                          style={{
                          width: 15,
                          height: 15,
                          borderWidth: 2,
                          borderRadius: 50,
                          marginRight: 2,
                          borderColor: '#18181877',
                          backgroundColor: selectedFilter === i ? '#18181877' : "transparent"
                          }}
                      />
                      <Text style={{fontStyle: 'italic', color: '#18181877'}}>{filters[i]}</Text>
                    </View>
                  </Pressable>
                ))}
                
              </View>
    
              <View style={{marginBottom: 15}} />
            </>
          )}



          {loadingBlockList && (
              <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#ff6600" />
                  <Text>Chargement des blocs...</Text>
              </View>
            )
          }
            
          <BlocList key={blocListKey} blocks={selectedBlocks} fetchBlocks={fetchBlocks} selectedMurId={selectedMurId} filter={selectedFilter} />
            
          


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
