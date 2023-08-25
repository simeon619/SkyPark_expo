import React from 'react';
import { Text, View } from '../Themed';
import { StatPostSchema } from '../../types/PostType';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { iconsStat } from '../../Utilis/data';

const CommentFooter = ({ stat }: { stat: StatPostSchema }) => {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Colors[colorScheme ?? 'light'].grey,
        borderBottomWidth: 1,
        borderTopColor: Colors[colorScheme ?? 'light'].grey,
        borderTopWidth: 1,
        paddingVertical: verticalScale(7),
        paddingHorizontal: horizontalScale(10),
        marginTop: verticalScale(5),
      }}
    >
      {iconsStat.map((icon: any, index) => {
        const { url, name }: { url: string; name: 'shares' | 'comments' | 'likes' } = icon;
        return (
          <TouchableOpacity
            key={index}
            style={{ flexDirection: 'row', columnGap: horizontalScale(5), alignItems: 'center' }}
          >
            <Image source={url} style={{ width: 20, height: 20 }} />
            <Text
              style={{
                fontSize: moderateScale(16),
                backgroundColor: Colors[colorScheme ?? 'light'].grey,
                alignSelf: 'center',
                fontWeight: '200',
                borderRadius: moderateScale(99),
                paddingHorizontal: moderateScale(7),
              }}
            >
              {stat[name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
export default CommentFooter;
