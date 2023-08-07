import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { LARGE_PIC_USER } from '../../constants/Value';
import useToggleStore from '../../managementState/client/preference';
import { groupJoinedSchema } from '../../types/PostType';
import { TextMedium } from '../StyledText';
import { View } from '../Themed';

import { Feather } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
const JoinedGroupComponent = ({ item }: { item: groupJoinedSchema | undefined }) => {
  if (!item) return null;
  const ImageComponent = ({
    children,
    ratioHeight,
    ratioWidth,
  }: {
    children: React.ReactNode;
    ratioHeight: number;
    ratioWidth: number;
  }) => {
    const { height } = useWindowDimensions();
    return (
      <View
        style={{
          width: `${ratioWidth}%`,
          // width: 'auto',
          // height: 'auto',
          height: height * (0.4 / ratioHeight),
          // flex: 1,
          overflow: 'hidden',
          ...shadow(5),
        }}
      >
        {children}
      </View>
    );
  };
  const { primaryColour } = useToggleStore((state) => state);
  return (
    <View
      style={{
        ...shadow(2),
        marginHorizontal: horizontalScale(2),
        borderRadius: moderateScale(20),
        overflow: 'hidden',
        paddingBottom: verticalScale(20),
        flex: 1,
      }}
    >
      <View
        style={{
          marginBottom: verticalScale(LARGE_PIC_USER / 1.75),
        }}
      >
        <ImageComponent
          ratioHeight={3}
          ratioWidth={100}
          children={
            <Image source={{ uri: item.banner }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
          }
        />
        <Image
          source={{ uri: item.pic }}
          style={{
            width: moderateScale(LARGE_PIC_USER),
            aspectRatio: 1,
            position: 'absolute',
            left: '10%',
            bottom: -LARGE_PIC_USER / 2,
            borderColor: 'white',
            borderWidth: 2,
            borderRadius: LARGE_PIC_USER,
          }}
        />
        <View
          lightColor="#0000"
          darkColor="#0000"
          style={{
            position: 'absolute',
            right: '5%',
            bottom: verticalScale(-50),
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: verticalScale(15),
          }}
        >
          <TextMedium style={{ fontSize: moderateScale(16), textAlign: 'center' }}>{item.name}</TextMedium>

          <TouchableOpacity
            style={{
              alignSelf: 'center',
              borderColor: primaryColour,
              borderWidth: 1,
              borderRadius: 50,
              padding: moderateScale(5),
            }}
          >
            <Feather name="minus" size={24} color={primaryColour} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default JoinedGroupComponent;
