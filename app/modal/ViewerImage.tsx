import { useLocalSearchParams, useRouter } from 'expo-router';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ImageView from 'react-native-image-viewing';
import { View } from '../../components/Themed';

const FormViewerImage = () => {
  const router = useRouter();

  const params = useLocalSearchParams();
  const uri = params.uri as string;

  const images = [
    {
      uri,
    },
  ];

  // const i = images.map((item) => {
  //   return {
  //     uri: item.uri,
  //   }
  // })
  return (
    <View style={{ justifyContent: 'center', flex: 1, backgroundColor: '#eee' }}>
      <StatusBar style="dark" backgroundColor="#000" />

      <ImageView
        images={images}
        imageIndex={0}
        // animationType="slide"
        // // swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={false}
        // swipeToCloseEnabled={false}
        animationType="fade"
        // presentationStyle="overFullScreen"
        // backgroundColor="#eee"
        visible={true}
        // presentationStyle="fullScreen"
        // HeaderComponent={() => (
        //   <TouchableOpacity
        //     accessibilityLabel="Back"
        //     accessibilityRole="button"
        //     onPress={() => router.back()}
        //     style={{
        //       top: top + 10,
        //       position: 'absolute',
        //       right: horizontalScale(10),
        //       padding: moderateScale(5),
        //       backgroundColor: '#0005',
        //       borderRadius: 50,
        //       zIndex: 12,
        //     }}
        //   >
        //     <AntDesign name="close" size={20} color="white" />
        //   </TouchableOpacity>
        // )}
        onRequestClose={() => router.back()}
      />
    </View>
  );
};

export default React.memo(FormViewerImage);
