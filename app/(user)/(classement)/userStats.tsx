import { COLOR_LEVEL } from '@/constants/colorLevel';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

export default function UserStatsScreen() {

    const { id, pseudo, email } = useLocalSearchParams();
    const navigation = useNavigation();
    const [userData, setUserData] = useState<User | null>(null);
    const [stats, setStats] = useState({
            'yellow': 0,
            'orange': 0,
            'blue': 0,
            'cyan': 0,
            'red': 0,
            'pink': 0,
            'green': 0,
            'black': 0,
        });
  
    useEffect(() => {
        if (pseudo != null) {
            navigation.setOptions({
                headerTitle: `Statistiques de ${pseudo}`,
            });
        }
        else if (email != null) {
            navigation.setOptions({
                headerTitle: `Statistiques de ${email}`,
            });
        }
    }, [pseudo, email]);

    const fetchUserStats = async (userId?: string) => {
        if (!userId) return;

        const tempStats: any = {
            'yellow': 0,
            'orange': 0,
            'blue': 0,
            'cyan': 0,
            'red': 0,
            'pink': 0,
            'green': 0,
            'black': 0,
        };
        try {
            const { data, error } = await supabase
            .from('validateBlocks')
            .select(`idBlock, blocks ( colorLevel )`)
            .eq('idUser', userId)
            

            if (error) {
                console.error('Erreur fetchUserStats:', error)
                alert('Erreur lors de la récupération des informations de l\'utilisateur')
                return;
            }


            data?.forEach((item: any) => {

                const color: string = item.blocks.colorLevel;
                tempStats[color]++;
            })
            setStats(tempStats);
           
        } catch (err) {
            console.error('Exception fetchUserStats:', err)
        }
    }

    
    useEffect(() => {
        fetchUserStats(id as string);
    }, [id]);

    
    const chartData = Object.entries(stats).map(([color, count]) => ({
        value: count as number,
        label: ''+count,
        frontColor: COLOR_LEVEL[color],
        sideColor: COLOR_LEVEL[color],
        topColor: COLOR_LEVEL[color],

    }));

  return (

    <ScrollView style={styles.container}>

        <View style={styles.card}>

            <BarChart
                data={chartData}
                height={220}
                barWidth={25}
                spacing={10}
                roundedTop={false}
                initialSpacing={17}
                noOfSections={10}
                showLine={false}
                xAxisThickness={0}
                yAxisThickness={0}
                barBorderRadius={7}
                hideYAxisText
                isThreeD={false}
                side="right"
                capThickness={4}
                showGradient={false}

            >
            </BarChart>

            
        </View>
        
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    
    
  },
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarImage: {
    width: 80,
    height: 80, 
    borderRadius: 50,
  },
  avatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  updateButton: {
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
  },
  signOutButton: {
    backgroundColor: 'red',
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
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
})