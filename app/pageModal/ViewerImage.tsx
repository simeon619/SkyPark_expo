import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ImageView from 'react-native-image-viewing';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { moderateScale } from '../../Utilis/metrics';
import { TextLight } from '../../components/StyledText';
import { View } from '../../components/Themed';
import { NavigationStackProps } from '../../types/navigation';

const FormViewerImage = ({ route }: NavigationStackProps) => {
  const params = route.params as any as { uri: string; caption: string };
  const uri = params.uri as string;
  const caption = params.caption as string;
  const navigation = useNavigation();

  const images = [
    {
      uri,
    },
  ];

  return (
    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: '#eee' }}>
      <StatusBar style="dark" backgroundColor="#00f0" />
      <ImageView
        images={images}
        imageIndex={0}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={false}
        visible={true}
        onRequestClose={() => navigation.goBack()}
        FooterComponent={() => (
          <Animated.Text entering={FadeInUp} exiting={FadeInDown}>
            <TextLight
              style={{
                textAlign: 'center',
                fontSize: moderateScale(13.5),
                color: '#fff',
                padding: moderateScale(5),
                backgroundColor: '#0001',
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

export default FormViewerImage;
