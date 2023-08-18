import { useLocalSearchParams, useRouter } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ImageView from 'react-native-image-viewing';
import { Text, View } from '../../components/Themed';
import { TextLight } from '../../components/StyledText';
import { moderateScale } from '../../Utilis/metrics';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const FormViewerImage = () => {
  const router = useRouter();

  const params = useLocalSearchParams();
  const uri = params.uri as string;
  const caption = params.caption as string;

  const images = [
    {
      uri,
    },
  ];

  return (
    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: '#eee' }}>
      <StatusBar style="dark" backgroundColor="#000" />
      <ImageView
        images={images}
        imageIndex={0}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={false}
        animationType="fade"
        visible={true}
        onRequestClose={() => router.back()}
        FooterComponent={() => (
          <Animated.Text entering={FadeInUp} exiting={FadeInDown}>
            <TextLight
              style={{
                textAlign: 'center',
                fontSize: moderateScale(15),
                color: '#fff',
                padding: moderateScale(5),
                backgroundColor: '#0008',
              }}
            >
              {caption}
            </TextLight>
          </Animated.Text>
        )}
      />
    </View>
  );
};

export default React.memo(FormViewerImage);
