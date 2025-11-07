import { Block } from '@/interfaces/Block';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';




interface Props {
  blocks: Block[];
}

export default function BlocList({ blocks }: Props) {
//   const navigation = useNavigation<HomeScreenProp>();

  const renderBlock = ({ item }: { item: Block }) => (
    <TouchableOpacity
      style={styles.card}
    //   onPress={() => navigation.navigate('BlockDetails', { blockId: item.id })}
    >
      {item.photo_url ? (
        <Image source={{ uri: item.photo_url }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999' }}>Pas de photo</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.nom}</Text>
        <Text style={styles.detail}>Couleur : {item.couleur}</Text>
        <Text style={styles.detail}>Cotation : {item.cotation}</Text>
        <Text style={styles.detail}>Ouvreur : {item.ouvreur}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={blocks}
      keyExtractor={(item) => item.id}
      renderItem={renderBlock}
      contentContainerStyle={{ paddingBottom: 16 }}
    />
  );
}

const styles = StyleSheet.create({
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
});
