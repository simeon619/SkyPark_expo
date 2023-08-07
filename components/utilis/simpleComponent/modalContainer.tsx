import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '../../../Utilis/metrics';

const modalContainer = ({ A }: { A: any }) => {
  return (
    <View>
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
          borderRadius: 20,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: '20%',
              alignItems: 'center',
              height: 3,
              borderRadius: 5,
              backgroundColor: 'grey',
              marginBottom: verticalScale(9),
            }}
          />

          {A}
        </View>
      </LinearGradient>
    </View>
  );
};

export default modalContainer;
