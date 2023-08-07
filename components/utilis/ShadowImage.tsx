import React from 'react';
import { moderateScale, shadow } from '../../Utilis/metrics';

import { View, useWindowDimensions } from 'react-native';

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
        width: `${ratioWidth}%`,
        // width: 'auto',
        // height: 'auto',
        height: height * (0.4 / ratioHeight),
        // flex: 1,
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
