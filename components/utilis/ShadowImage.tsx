import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { moderateScale, shadow } from '../../Utilis/metrics';

const ShadowImage = ({
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
        width: `${ratioWidth - 1}%`,
        // alignSelf: 'center',
        height: ratioHeight === 0 ? 'auto' : height * (0.4 / ratioHeight),
        maxHeight: height / 1.5,
        overflow: 'hidden',
        borderRadius: moderateScale(20),
        ...shadow(5),
      }}
    >
      {children}
    </View>
  );
};
export default ShadowImage;
