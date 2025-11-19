import { COLOR_LEVEL } from '@/constants/colorLevel';
import { useAuth } from '@/contexts/AuthContext';
import { Block } from '@/interfaces/Block';
import { ValidateBlock } from '@/interfaces/ValidateBlocks';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Dimensions, Image, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SalleMapMini from './SalleMapMini';


interface Props {
  blocks: Block[];
  fetchBlocks: () => Promise<void>;
  selectedMurId: string | null;
}



export default function BlocList({ blocks, fetchBlocks, selectedMurId }: Props) {

  const insets = useSafeAreaInsets();
  const SCREEN_HEIGHT = Dimensions.get('screen').height - insets.top - insets.bottom;
  // console.log('\nscreen', Dimensions.get('screen').height,
  //             '\nwindow', Dimensions.get('window').height,
  //             '\nbottom', insets.bottom,
  //             '\ntop', insets.top,
  //             '\ntotal', insets.top + Dimensions.get('window').height + insets.bottom
  //           )

  const [selectedBlock, setSelectedBlock] = useState<Block | undefined>();
  const [validateBlocks, setValidateBlocks] = useState<ValidateBlock[]>([]);
  
  const [visible, setVisible] = useState(false);
  const translateY = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  const [imageVisible, setImageVisible] = useState(false);
  const [prefetched, setPrefetched] = useState<string | null>(null);

  const [interactable, setInteractable] = useState(false);

  const { user, userInfos } = useAuth()

  const openImage = async (url: string) => {
    try {

      await Image.prefetch(url);
      setPrefetched(url);
      setImageVisible(true);
    }catch(e) {
      console.error("Image not found")
    }
  };

  const closeImage = () => {
    setImageVisible(false);
    // setPrefetched(null);
  };

  function LazySalleMapMini({ wall }: { wall: number }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const t = setTimeout(() => setShow(true), 40 + Math.random() * 120); 
      return () => clearTimeout(t);
    }, []);

    if (!show) return null;
    return <SalleMapMini wall={wall} />;
  }

  
  const openSheet = (block: Block) => {
    if (block.photo_url) Image.prefetch(block.photo_url);
    setSelectedBlock(block);
    setVisible(true);
    setInteractable(false);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => setInteractable(true));
    closeImage()
  };

  const closeSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      setSelectedBlock(undefined);
    });
  };

  // Gestion du swipe down
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150 || gestureState.vy > 0.5) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;


  const validerBlock = async (block: Block) => {
    
    const validateBlock = {
      idBlock: block.id,
      idUser: user?.id,
    }

    if (!validateBlock.idUser) return;

    const { data, error } = await (supabase
      .from('validateBlocks') as any)
      .upsert([validateBlock], { onConflict: ['idBlock', 'idUser'] })
      .select();

    if (error) {
      console.error("Erreur upsert validateBlock :", error);
      return null;
    }

    console.log('valider', block.id)
    
   fetchValidateBlocks();
  }

  const annulerBlock = async (block: Block) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('validateBlocks')
      .delete()
      .eq('idBlock', block.id)
      .eq('idUser', user.id);

    if (error) {
      console.error("Erreur lors de l'annulation du bloc :", error);
      return;
    }

    console.log('Bloc annulé :', block.id);

    fetchValidateBlocks();
  }

  const fetchValidateBlocks = async () => {
    setInteractable(false);
    const { data, error } = await supabase
        .from('validateBlocks')
        .select('*')
        .eq('idUser', user?.id);

    if (error) {
        console.error(error);
        alert('Erreur lors de la récupération des blocs');
    } else {
        setValidateBlocks(data || []);
        setInteractable(true);
    }
  }

  function test(s: Block) {
    const selectedId = s.id;
    const isValidated = validateBlocks.some(b => b.idBlock === selectedId);

    console.log(isValidated)
  }


  useEffect(() => {
      fetchValidateBlocks();
  }, []);

  

  const handleDeleteBlock = (block: Block) => {
    Alert.alert(
      'Suppression',
      'Êtes-vous sûr de vouloir supprimer ce bloc ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteBlock(block),
        },
      ]
    )
  }

  const deleteBlock = async (block: Block) => {
    console.log('Suppression...')
    const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', block.id);

    if (error) {
        console.error(error);
        alert('Erreur lors de la suppression du bloc');
    } else {
      fetchBlocks();
      fetchValidateBlocks();
      closeSheet();
    }
  }

  return (
    <View style={styles.listContainer}>


      <View style={{display: 'flex', alignItems: 'center'}}>
        
        { (userInfos?.admin && selectedMurId && Number(selectedMurId) > 0) ? (
          <TouchableOpacity
            disabled={!interactable}
            style={styles.addBlockButton}
            onPress={ () => router.push(`/addBlock?selectedMurId=${selectedMurId}`)}
          >
            <Text style={styles.addBlockButtonText}>Ajouter un bloc</Text>
          </TouchableOpacity>
          ) :''
        }

      </View>

      {blocks.map((item, index) => {
        
        const isValidated = validateBlocks.some(b => b.idBlock === item.id);
        
        return (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.card,
            isValidated ? styles.bgValidate : '',
            index === 0 ? styles.cardFirst : {}, 
            index === blocks.length - 1 ? styles.cardLast : {}
          ]}
          onPress={() => openSheet(item)}
        >
          <View style={styles.imageContainer}>
            {item.photo_url ? (
              <Image
                source={{ uri: item.photo_url }}
                style={[styles.image, { borderColor: item.colorBlock }]}
                onError={() => {
                  return null;
                }}
              />
            ) : (
              <View
                style={[
                  styles.image,
                  {
                    borderColor: item.colorBlock,
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

            <View style={styles.colorLevel}>
              <Ionicons name="cellular" size={50} color={COLOR_LEVEL[item.colorLevel]} ></Ionicons>
            </View>

            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={styles.detailPoints}>{item.points}</Text>
              <Text style={styles.detailPts}>pts</Text>
            </View>
          </View>
        </TouchableOpacity>
      )})}


      
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View 
            style={[
              styles.backdrop,
              { opacity: backdropOpacity }
            ]}
          >
            <TouchableOpacity 
              style={{ flex: 1 }} 
              activeOpacity={1}
              onPress={closeSheet}
            />
          </Animated.View>










          {/* Sheet */}
          {selectedBlock && (
          <Animated.View
            style={[
              styles.sheet,
              {height: SCREEN_HEIGHT *0.9},
              validateBlocks.some(b => b.idBlock === selectedBlock.id) ? '' : '',
              { transform: [{ translateY }] }
            ]}
            {...panResponder.panHandlers}
          >
            
            {/* Handle */}
            
            <View style={[styles.handleContainer, 
                          
                        ]}>
              <View style={[styles.handle]} />
            </View>




            <View 
              style={styles.scrollView}
              // showsVerticalScrollIndicator={false}
              // bounces={false}
            >
              
                <View>
                  <View style={styles.content}>
                    {/* Header */}
                    <View
                      style={[
                        styles.card,
                        validateBlocks.some(b => b.idBlock === selectedBlock.id) ?
                        '' : '', 
                        { shadowColor: 'transparent', elevation: 0},
                      ]}
                    >
                      <View style={styles.imageContainer}>
                        {selectedBlock.photo_url ? (
                          <Image
                            source={{ uri: selectedBlock.photo_url }}
                            style={[styles.image, { borderColor: selectedBlock.colorBlock }]}
                            onError={() => {
                              return null;
                            }}
                          />
                        ) : (
                          <View
                            style={[
                              styles.image,
                              {
                                borderColor: selectedBlock.colorBlock,
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
                          <LazySalleMapMini wall={selectedBlock.murId} />
                        </View>
                        <View style={styles.colorLevel}>
                          <Ionicons name="cellular" size={50} color={COLOR_LEVEL[selectedBlock.colorLevel]} ></Ionicons>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row'}}>
                          <Text style={styles.detailPoints}>{selectedBlock.points}</Text>
                          <Text style={styles.detailPts}>pts</Text>
                        </View>
                      </View>
                    </View>

                    {/* image + modale de l'image */}
                    <View style={styles.detailsContainer}>


                      <Modal visible={imageVisible} transparent={true} onRequestClose={closeImage}>
                        <TouchableOpacity style={styles.closeButton} onPress={closeImage}>
                          <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                        <ImageViewer
                          imageUrls={[{ url: prefetched as string }]}
                          enableSwipeDown={false}
                          onSwipeDown={closeImage}
                          renderIndicator={() => <></>}
                          saveToLocalByLongPress={false}
                          backgroundColor="rgba(0,0,0,0.9)"
                        />
                      </Modal>
                      {selectedBlock.photo_url ? (
                        <TouchableOpacity onPress={() => openImage(selectedBlock.photo_url || '')}>
                          <Image 
                            source={{ uri: selectedBlock.photo_url }}
                            style={[styles.imageInfos, { height: SCREEN_HEIGHT*0.66, borderColor: selectedBlock.colorBlock }]}
                          />
                        </TouchableOpacity>
                        ) : (
                          <View
                            style={[
                              styles.imageInfos,
                              {
                                height: SCREEN_HEIGHT*0.66,
                                borderColor: selectedBlock.colorBlock,
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

                    
                    {/* Action Button */}
                    <TouchableOpacity 
                      disabled={!interactable}
                      style={[styles.actionButton,
                        {top: SCREEN_HEIGHT*0.66 + 70},
                        validateBlocks.some(b => b.idBlock === selectedBlock.id) ?
                        styles.btnSupprimer : styles.btnValider
                      ]}
                      onPress={() => validateBlocks.some(b => b.idBlock === selectedBlock.id) ? 
                        annulerBlock(selectedBlock)
                        : validerBlock(selectedBlock)
                      }
                    >
                      {!interactable ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) :
                      
                      
                      validateBlocks.some(b => b.idBlock === selectedBlock.id) ?
                        (
                          <Ionicons style={styles.actionButtonText} name="checkmark" size={30} color="black" />
                        ) 
                        :(
                          <Ionicons style={styles.actionButtonText} name="checkmark" size={30} color="black" />
                        ) 
                      }
                      
                    </TouchableOpacity>
                    
                    {/* Bottom de la card */}
                    <View style={[styles.bottom, {height: SCREEN_HEIGHT*0.9 - (SCREEN_HEIGHT*0.66 + 70 + 24 + 5)}]}>
                      
                      { userInfos?.admin ?
                      (
                        <TouchableOpacity
                          disabled={!interactable}
                          style={styles.deleteBlockButton}
                          onPress={ () => handleDeleteBlock(selectedBlock)}
                        >
                          {!interactable ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) :
                            <Text style={styles.deleteBlockButtonText}>Supprimer le bloc</Text>
                          }
                        </TouchableOpacity>
                      ) : '' }


                    </View>

                  </View>
                </View>
            </View>
          </Animated.View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 24,
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
  info: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: 'transparent',
    padding: 12,
  },
  detailPoints: {
    fontSize: 25,
    fontWeight: '800',
    opacity: 0.3,
  },
  detailPts: {
    fontWeight: '800',
    opacity: 0.3,
    marginTop: 10
  },
  detailMap: {
    position: 'absolute',
    left: 75,
  },
  
  // Modal & Sheet
  modalContainer: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // height: SCREEN_HEIGHT * 0.9,
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  bgValidate: {
    backgroundColor: '#bfffc4ff',
  },
  content: {
    // paddingHorizontal: 20,
    // paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  pointsBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pointsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailEmoji: {
    fontSize: 24,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  section: {
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  actionButton: {
    position:'absolute',
    width: 70,
    height: 70,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 25,
    // top: SCREEN_HEIGHT*0.66 + 70,
    transform: 'translateY(-35px)',
    
    // backgroundColor: '#41b93eff',
    backgroundColor: '#bdbdbdff',

    
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  imageInfos: {
    width: 'auto',
    // height: SCREEN_HEIGHT*0.66
  },
  colorLevel: {
    width: 50,
    height: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  btnValider: {
    backgroundColor: '#c3c3c3ff',
  },
  btnSupprimer: {
    backgroundColor: '#41b93eff',
  },
  bottom: {
    backgroundColor: 'transparent', 
    overflow: 'hidden', 
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteBlockButton: {

    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'red',
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',


    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1
  },
  deleteBlockButtonText: {
    fontWeight: 600,
    color: '#fff'
  },

  addBlockButton: {

    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#50fd50ff',
    borderRadius: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1
  },
  addBlockButtonText: {
    fontWeight: 600,
    color: '#fff'
  }
});