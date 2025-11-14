import { Block } from '@/interfaces/Block';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SalleMapMini from './SalleMapMini';


interface Props {
  blocks: Block[];
}

export default function BlocList({ blocks }: Props) {


  function LazySalleMapMini({ wall }: { wall: number }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const t = setTimeout(() => setShow(true), 40 + Math.random() * 120); 
      return () => clearTimeout(t);
    }, []);

    if (!show) return null;
    return <SalleMapMini wall={wall} />;
  }

  return (
    <View style={styles.listContainer}>
      {blocks.map((item, index) => (
        
        <TouchableOpacity
          key={item.id}
          style={[styles.card, (index == 0) ? styles.cardFirst : '', (index == blocks.length - 1) ? styles.cardLast : '']}
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
                <Text style={{ color: '#999', textAlign: 'center'}}>Pas de photo</Text>
              </View>
            )}
          </View>
          
          <View style={styles.info}>
            <View style={styles.detailMap}>
              <LazySalleMapMini wall={item.murId} />
            </View>
            <View></View>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={styles.detailPoints}>{item.points}</Text>
              <Text style={styles.detailPts}>pts</Text>
            </View>
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
    marginBottom: 2,
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
  detailPoints: {
    fontSize: 25,
    fontWeight: 800,
    opacity: 0.3,
  },
  detailPts: {
    fontWeight: 800,
    opacity: 0.3,
    marginTop: 10
  },
  detailMap: {
    position: 'absolute',
    left: 0,
    userSelect: 'none',
    
  }
});
