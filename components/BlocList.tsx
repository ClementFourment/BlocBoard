import { Block } from '@/interfaces/Block';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface Props {
  blocks: Block[];
}

export default function BlocList({ blocks }: Props) {
//   const navigation = useNavigation<HomeScreenProp>();

  return (
    <View style={styles.listContainer}>
      {blocks.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          // onPress={() => navigation.navigate('BlockDetails', { blockId: item.id })}
        >
          <View style={styles.imageContainer}>
            {item.photo_url ? (
              <Image
                source={{ uri: item.photo_url }}
                style={[styles.image, { borderColor: item.color }]}
              />
            ) : (
              <View
                style={[
                  styles.image,
                  {
                    borderColor: item.color,
                    backgroundColor: '#eee',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}
              >
                <Text style={{ color: '#999' }}>Pas de photo</Text>
              </View>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.detail}>{item.cotation}</Text>
            <Text style={styles.detail}>200pts</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 24,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    padding: 4
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
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: 'transparent',
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
