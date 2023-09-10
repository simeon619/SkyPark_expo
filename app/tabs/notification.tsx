import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, View as ViewNatif, useWindowDimensions, FlatList, TouchableOpacity } from 'react-native';
import { MagicModalPortal, NewConfigProps, magicModal } from 'react-native-magic-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iconsDetailNotif } from '../../Utilis/data';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextMedium } from '../../components/StyledText';
import { View } from '../../components/Themed';
import notif from '../../notif.json';

const NotificationTabScreen = () => {
  const { width } = useWindowDimensions();
  const [blur, setBlur] = useState(0);
  const setActionType = (action: string, stats: { like: number; share: number; comment: number }) => {
    if (action === 'like') {
      stats['like'];
      return `et ${stats['like']} voisins ont like ton post`;
    }
    if (action === 'share') {
      return `et ${stats['share']} voisins ont partagé ton post`;
    }
    if (action === 'comment') {
      return `et ${stats['comment']} voisins ont commenté ton post`;
    }
    if (action === 'post') {
      return `a ajoutez une nouvelle photo`;
    }
  };
  const confModal: NewConfigProps = {
    useNativeDriver: true,
    animationIn: 'slideInUp',
    animationOut: 'slideOutDown',
    animationInTiming: 600,
    animationOutTiming: 600,
    backdropTransitionOutTiming: 500,
    backdropColor: 'black',
    backdropOpacity: 0,
    useNativeDriverForBackdrop: true,
    onModalHide() {
      setBlur(0);
    },
    onModalShow() {
      setBlur(1);
    },
  };

  // const SettingsNotif = () => {
  //   return (
  //     <View>
  //       <modalContainer>
  //         {iconsDetailNotif.map((item, key) => {
  //           return (
  //             <ViewNatif
  //               key={key}
  //               style={{
  //                 width,
  //                 flexDirection: 'row',
  //                 alignItems: 'center',
  //                 justifyContent: 'flex-start',
  //                 paddingVertical: verticalScale(5),
  //                 columnGap: horizontalScale(15),
  //               }}
  //             >
  //               <Image source={item.url} style={{ width: moderateScale(23), aspectRatio: 1 }} />
  //               <TextLight style={{ fontSize: moderateScale(16) }}>{item.name}</TextLight>
  //             </ViewNatif>
  //           );
  //         })}
  //       </modalContainer>
  //     </View>
  //   );
  // };

  const DetailNotif = ({ item }: { item: any }) => {
    return (
      <LinearGradient
        colors={['#FFA7A933', '#fefefe33']}
        locations={[0, 0.4]}
        style={{
          position: 'absolute',
          left: horizontalScale(1),
          zIndex: 99,
          right: horizontalScale(1),
          bottom: verticalScale(80),
          padding: moderateScale(10),
          borderRadius: 10,
        }}
      >
        <ViewNatif
          style={{
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <ViewNatif
            style={{
              width: '20%',
              alignItems: 'center',
              height: 3,
              borderRadius: 5,
              backgroundColor: 'grey',
              marginBottom: verticalScale(9),
            }}
          />
          <Image
            source={{ uri: item.user.pic }}
            style={{
              width: moderateScale(70),
              aspectRatio: 1,
              borderRadius: moderateScale(500),
              paddingVertical: verticalScale(10),
            }}
          />
          <ViewNatif style={{ paddingVertical: verticalScale(10) }}>
            <ViewNatif style={{ width: width * 0.7 }}>
              <TextLight style={{ textAlign: 'center', fontSize: moderateScale(15) }}>
                <TextMedium>{item.user.name}</TextMedium>{' '}
                <TextLight>{setActionType(item.action, item.statPostTrigger)}</TextLight>
              </TextLight>
            </ViewNatif>
          </ViewNatif>
          <ViewNatif style={{ width: '102%', alignItems: 'center', height: 1, backgroundColor: '#0002' }} />
          <ViewNatif
            style={{
              flex: 1,
              rowGap: verticalScale(10),
              paddingLeft: horizontalScale(60),
              columnGap: horizontalScale(10),
              paddingVertical: verticalScale(10),
            }}
          >
            {iconsDetailNotif.map((item, key) => {
              return (
                <ViewNatif
                  key={key}
                  style={{
                    width,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingVertical: verticalScale(5),
                    columnGap: horizontalScale(15),
                  }}
                >
                  <Image source={item.url} style={{ width: moderateScale(23), aspectRatio: 1 }} />
                  <TextLight style={{ fontSize: moderateScale(16) }}>{item.name}</TextLight>
                </ViewNatif>
              );
            })}
          </ViewNatif>
        </ViewNatif>
      </LinearGradient>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BlurView style={[{ zIndex: blur }, StyleSheet.absoluteFill]} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: verticalScale(10),
          paddingHorizontal: horizontalScale(10),
        }}
      >
        <View>
          <TextMedium style={{ fontSize: moderateScale(21) }}>Notifications</TextMedium>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: horizontalScale(16),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // magicModal.show(() => <SettingsNotif />, confModal);
            }}
          >
            <Image
              source={require('../../assets/icon/Settings.png')}
              style={{ width: moderateScale(22), aspectRatio: 1 }}
            />
          </TouchableOpacity>
          <Image
            source={require('../../assets/icon/search.png')}
            style={{ width: moderateScale(22), aspectRatio: 1 }}
          />
        </View>
      </View>
      <View style={{ paddingHorizontal: horizontalScale(10), flex: 1 }}>
        <FlatList
          data={notif}
          // estimatedItemSize={150}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: verticalScale(10),
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', columnGap: horizontalScale(10) }}>
                <Image
                  source={{ uri: item.user.pic }}
                  style={{ width: moderateScale(55), aspectRatio: 1, borderRadius: 500 }}
                />
                <View>
                  <View style={{ width: width * 0.7 }}>
                    <TextLight>
                      <TextMedium>{item.user.name}</TextMedium>{' '}
                      <TextLight>{setActionType(item.action, item.statPostTrigger)}</TextLight>
                    </TextLight>
                  </View>
                  <TextLight>
                    {' '}
                    {
                      //@ts-ignore
                      formatPostDate(item.createdAt)
                    }
                  </TextLight>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  magicModal.show(() => <DetailNotif item={item} />, {
                    ...confModal,
                  });
                }}
              >
                <AntDesign name="ellipsis1" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <MagicModalPortal />
    </SafeAreaView>
  );
};

export default NotificationTabScreen;
