import React, { memo } from 'react';
import { moderateScale } from '../../Utilis/metrics';
import { TextThin } from '../StyledText';
import { View } from '../Themed';

const TabPageItem = ({ children, focused }: { children: any; focused: boolean }) => {
  return (
    <View
      lightColor="#0000"
      darkColor="#0000"
      style={[
        {
          alignSelf: 'flex-start',
          // backgroundColor: focused ? "red" : "#0000",
          // borderRadius: 80,
          // paddingHorizontal: 5,
        },
      ]}
    >
      <TextThin
        style={{
          fontSize: moderateScale(16),
          textAlign: 'left',
          
          opacity: focused ? 1 : 0.4,
        }}
      >
        {children}
      </TextThin>
    </View>
  );
};

export default memo(TabPageItem);
