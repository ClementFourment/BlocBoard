// SalleMap.tsx

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { murs } from '../data/murs';

interface Mur {
  id: string;
  x: number;
  y: number;
  rotation: number;
  width: number;
  height: number;
  // Note: La couleur sera gérée par l'état `selectedMurId`
}

interface Props {
  onSelectMur: (mur: string) => void;
}
const pageHeight = 400;

const DEFAULT_COLOR = '#e3e3e3ff';
const SELECTED_COLOR = 'black';

export default function SalleMap({ onSelectMur }: Props) {
  const [selectedMurId, setSelectedMurId] = useState<string | null>(null);

  const handlePress = (murId: string) => {
    
    setSelectedMurId(murId); 
    onSelectMur(murId);
  };

  return (
    <View style={styles.container}>
      
      
 
      <Svg height="100%" width="100%" style={styles.svg}>
        {murs.map((mur) => {
          const currentColor = mur.id === selectedMurId ? SELECTED_COLOR : DEFAULT_COLOR;

          return mur.portions.map((portion, i) => {
            return (
              <Rect
                key={`${mur.id}-${i}`}
                x={portion.x}
                y={portion.y}
                width={portion.width}
                height={portion.height}
                transform={`rotate(${portion.rotation}, ${portion.x + portion.width / 2}, ${portion.y + portion.height / 2})`}
                fill={currentColor}
              />
            );
          })
          
        })}
      </Svg>
      {murs.map((mur) => {
        return mur.portions.map((portion, i) => {
          return (
            <TouchableOpacity
              key={`hitbox-${mur.id}-${i}`}
              style={{
                backgroundColor: 'transparent',
                opacity: 0.5,
                position: 'absolute',
                left: portion.x,
                top: portion.y,
                width: portion.width,
                height: portion.height + 20,
                
                transform: [
                  { translateY: -10 },
                  { rotate: `${portion.rotation}deg` },
                ],
                
              }}
              onPress={() => handlePress(mur.id)}
            />
          );
        })
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tinyLogo: {
    position: 'absolute',
    marginTop: 20,
    width: 300,
    height: 300,
  },
  container: {
    height: pageHeight,
    marginVertical: 16,

    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  svg: {
    backgroundColor: 'transparent', 
  }
});