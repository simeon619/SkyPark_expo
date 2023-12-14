import React from 'react';
import { moderateScale } from '../../Utilis/metrics';
import { TextExtraLightItalic, TextThin } from '../StyledText';
import { View } from '../Themed';

const TabPageItem = ({ children, focused }: { children: any; focused: boolean }) => {
  return (
    <View
      lightColor="#0000"
      darkColor="#0000"
      style={[
        {
          alignSelf: 'flex-start',

        },
      ]}
    >
      <TextExtraLightItalic
        style={{
          fontSize: moderateScale(16),
          textAlign: 'left',
          opacity: focused ? 1 : 0.4,
        }}
      >
        {children}
      </TextExtraLightItalic>
    </View>
  );
};

export default TabPageItem;
