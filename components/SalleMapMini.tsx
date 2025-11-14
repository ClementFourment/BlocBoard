// SalleMap.tsx

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { murs } from '../data/murs';

const pageHeight = 70;

const DEFAULT_COLOR = '#e3e3e3ff';
const SELECTED_COLOR = 'black';

export default function SalleMapMini({ wall }: { wall: number }) {

  return (
    <View style={styles.container}>
 
      <Svg height="100%" width="100%" style={styles.svg}>
        {murs.map((mur) => {
          const currentColor = mur.id === wall.toString() ? SELECTED_COLOR : DEFAULT_COLOR;

          return mur.portions.map((portion, i) => {
            return (
              <Rect
                key={`${mur.id}-${i}`}
                x={portion.x*0.2}
                y={portion.y*0.2}
                width={portion.width*0.2}
                height={portion.height*0.2}
                transform={`rotate(${portion.rotation}, ${portion.x*0.2 + portion.width*0.2 / 2}, ${portion.y*0.2 + portion.height*0.2 / 2})`}
                fill={currentColor}
              />
            );
          })
          
        })}
      </Svg>
      {murs.map((mur) => {
        return mur.portions.map((portion, i) => {
          return (
            <View
              key={`hitbox-${mur.id}-${i}`}
              style={{
                backgroundColor: 'transparent',
                opacity: 0.5,
                position: 'absolute',
                left: portion.x*0.2,
                top: portion.y*0.2,
                width: portion.width*0.2,
                height: portion.height*0.2 + 20*0.2,
                
                transform: [
                  { translateY: -10*0.2 },
                  { rotate: `${portion.rotation}deg` },
                ],
                
              }}
            />
          );
        })
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: pageHeight,
    width: 70,
    backgroundColor: 'transparent',
    userSelect: 'none'
  },
  svg: {
    backgroundColor: 'transparent', 
  }
});