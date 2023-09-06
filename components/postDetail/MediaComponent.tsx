import React, { useState } from 'react';
import {
  Image,
  ImageLoadEventData,
  ImageProgressEventDataIOS,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { horizontalScale, verticalScale } from '../../Utilis/metrics';
import { View } from '../Themed';

import { useNavigation } from '@react-navigation/native';
import { HOST } from '../../constants/Value';
import { UrlData } from '../../lib/SQueryClient';
import ShadowImage from '../utilis/ShadowImage';

const GAP_MEDIA = 10;
const MediaComponent = ({ media, caption }: { media: UrlData[] | undefined; caption: string | undefined }) => {
  if (!media) {
    return null;
  }

  const numberMedia = media?.length;

  const handleImageLoad = (event: NativeSyntheticEvent<ImageProgressEventDataIOS>) => {};

  return (
    <View style={{ alignItems: 'center' }}>
      {numberMedia === 1 && <ImageComponent uri={HOST + media[0].url} caption={caption} />}
      {numberMedia === 2 && (
        <View style={{ flexDirection: 'row', columnGap: horizontalScale(GAP_MEDIA) }}>
          {[0, 1].map((index) => (
            <ShadowImage
              key={index}
              ratioHeight={1}
              ratioWidth={48.5}
              children={<ImageComponent uri={HOST + media[index].url} caption={caption} />}
            />
          ))}
        </View>
      )}
      {numberMedia === 3 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: verticalScale(GAP_MEDIA),
          }}
        >
          <ShadowImage
            ratioHeight={1.4}
            ratioWidth={100}
            children={<ImageComponent uri={media[0].url} caption={caption} />}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              columnGap: horizontalScale(GAP_MEDIA),
            }}
          >
            {[1, 2].map((index) => (
              <ShadowImage
                key={index}
                ratioHeight={2}
                ratioWidth={48.5}
                children={<ImageComponent uri={media[index].url} caption={caption} />}
              />
            ))}
          </View>
        </View>
      )}

      {numberMedia === 4 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: verticalScale(GAP_MEDIA) }}>
          <ShadowImage
            ratioHeight={1.4}
            ratioWidth={100}
            children={<ImageComponent uri={media[0].url} caption={caption} />}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              columnGap: horizontalScale(GAP_MEDIA),
            }}
          >
            {[1, 2, 3].map((index) => (
              <ShadowImage
                key={index}
                ratioHeight={2.5}
                ratioWidth={31.5}
                children={<ImageComponent uri={media[index].url} caption={caption} />}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const ImageComponent = ({ uri, caption }: { uri: string; caption: string | undefined }) => {
  const { height: heights } = useWindowDimensions();
  const navigation = useNavigation();
  // const [visible, setVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(0);

  const handleImageLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    const { width, height } = event.nativeEvent.source;
    const imageAspectRatio = width / (height || 1);
    setAspectRatio(imageAspectRatio);
    // setVisible(true);

    // setAspectRatio(imageAspectRatio);
  };

  return (
    <TouchableWithoutFeedback
      // style={{ width: '100%', height: 'auto' }}
      onPress={() => {
        //@ts-ignore
        navigation.navigate('ViewerImage', { uri, caption });
      }}
    >
      <Image
        onLoad={handleImageLoad}
        style={{
          width: '100%',
          maxHeight: heights / 1.25,
          aspectRatio: aspectRatio !== null ? aspectRatio : 0,
        }}
        source={{ uri }}
      />
    </TouchableWithoutFeedback>
  );
};

export default MediaComponent;
