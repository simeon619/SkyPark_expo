import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, useColorScheme } from 'react-native';
import { formatPostDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { MEDIUM_PIC_USER, SMALL_PIC_USER } from '../../constants/Value';
import Groups from '../../group.json';
import useToggleStore from '../../managementState/client/preference';
import { TextLight, TextMedium } from '../StyledText';
import { View } from '../Themed';
import ShadowImage from './ShadowImage';
import { useNavigation } from '@react-navigation/native';

const ItemsActivity = () => {
  const colorScheme = useColorScheme();
  const { primaryColour } = useToggleStore((state) => state);
  const navigation = useNavigation();

  return (
    <View style={{ paddingHorizontal: horizontalScale(10), marginTop: verticalScale(25) }}>
      {Groups.map((item, index) => {
        return (
          <View
            lightColor={'#efefef'}
            key={index}
            style={{
              ...shadow(1),
              marginBottom: verticalScale(25),
              padding: moderateScale(20),
              borderRadius: moderateScale(20),
            }}
          >
            <View
              lightColor={'#efefef'}
              style={{
                marginBottom: verticalScale(MEDIUM_PIC_USER / 2),
              }}
            >
              <ShadowImage
                ratioHeight={2.8}
                ratioWidth={100}
                children={<Image source={{ uri: item.banner }} style={{ width: '100%', height: '100%' }} />}
              />
              <Image
                source={{ uri: item.pic }}
                style={{
                  width: moderateScale(MEDIUM_PIC_USER),
                  aspectRatio: 1,
                  position: 'absolute',
                  bottom: -MEDIUM_PIC_USER / 2 + 10,
                  alignSelf: 'center',
                  borderColor: 'white',
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                  borderRadius: MEDIUM_PIC_USER,
                }}
              />
            </View>
            <View
              lightColor={'#efefef'}
              style={{
                alignItems: 'center',
                // rowGap: verticalScale(5),
                // backgroundColor: Colors[colorScheme ?? 'light'].lightGrey,
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate('ItemGroup', {
                    name: item.name,
                    pic: item.pic,
                    banner: item.banner,
                    id: item.id,
                  });
                }}
              >
                <TextMedium style={{ fontSize: moderateScale(16), textAlign: 'center' }}>{item.name}</TextMedium>
              </TouchableWithoutFeedback>
              <TextLight
                style={{
                  fontSize: moderateScale(14),
                  textAlign: 'center',
                  color: Colors[colorScheme ?? 'light'].greyDark,
                  marginTop: verticalScale(5),
                }}
              >
                Derniere activite : {formatPostDate(item.info.lastActivity)}
              </TextLight>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors[colorScheme ?? 'light'].lightGrey,
                }}
              >
                {item.users.map((user, index) => (
                  <Image
                    key={index}
                    source={{ uri: user.pic }}
                    style={[
                      {
                        width: moderateScale(SMALL_PIC_USER + 5),
                        aspectRatio: 1,
                        borderRadius: 50,
                        borderColor: 'white',
                        borderWidth: 2,
                      },
                      index !== 0 && { marginLeft: -horizontalScale(15) },
                    ]}
                  />
                ))}
              </View>
              <TextLight
                style={{
                  fontSize: moderateScale(15),
                  textAlign: 'center',
                  color: Colors[colorScheme ?? 'light'].greyDark,
                }}
              >
                Groupe {item.info.statut} / {item.info.numberUser} Membre{item.info.numberUser > 1 ? 's' : ''}
              </TextLight>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  borderColor: primaryColour,
                  borderWidth: 1,
                  borderRadius: 50,
                  paddingHorizontal: horizontalScale(10),
                }}
              >
                <TextLight style={{ fontSize: moderateScale(16), textAlign: 'center', color: primaryColour }}>
                  Quitter le groupe
                </TextLight>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
};
export default ItemsActivity;
