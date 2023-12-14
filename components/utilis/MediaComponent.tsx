import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import { horizontalScale, verticalScale } from '../../Utilis/metrics';
import { HOST } from '../../constants/Value';
import { UrlData } from '../../lib/SQueryClient';
import { View } from '../Themed';
import ShadowImage from './ShadowImage';

const GAP_MEDIA = 10;
const MediaComponent = ({ media, caption }: { media: UrlData[] | undefined; caption: string | undefined }) => {
  if (!media) {
    return null;
  }
  const numberMedia = media?.length;

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {numberMedia === 1 && (
        <ShadowImage
          ratioHeight={0}
          ratioWidth={100}
          children={<ImageComponent height={'auto'} width={'100%'} uri={HOST + media[0].url} caption={caption || ''} />}
        />
      )}
      {numberMedia === 2 && (
        <View style={{ flexDirection: 'row', columnGap: horizontalScale(GAP_MEDIA) }}>
          {[0, 1].map((index) => (
            <ShadowImage
              key={index}
              ratioHeight={1}
              ratioWidth={48.5}
              children={
                <ImageComponent uri={HOST + media[index].url} width={'100%'} height={'100%'} caption={caption || ''} />
              }
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
            children={<ImageComponent uri={media[0].url} width={'100%'} height={'100%'} caption={caption || ''} />}
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
                children={
                  <ImageComponent uri={media[index].url} width={'100%'} height={'100%'} caption={caption || ''} />
                }
              />
            ))}
          </View>
        </View>
      )}

      {numberMedia === 4 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: verticalScale(GAP_MEDIA),
            // justifyContent: 'space-between',
          }}
        >
          <ShadowImage
            ratioHeight={1.4}
            ratioWidth={100}
            children={<ImageComponent uri={media[0].url} width={'100%'} height={'100%'} caption={caption || ''} />}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'nowrap',
              columnGap: horizontalScale(GAP_MEDIA),
              justifyContent: 'space-between',
            }}
          >
            {[1, 2, 3].map((index) => (
              <ShadowImage
                key={index}
                ratioHeight={2.5}
                ratioWidth={31.5}
                children={
                  <ImageComponent uri={media[index].url} width={'100%'} height={'100%'} caption={caption || ''} />
                }
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
export default MediaComponent;

const ImageComponent = memo(
  ({
    uri,
    width,
    height,
    caption,
  }: {
    uri: string;
    width: DimensionValue;
    height: DimensionValue;
    caption: string;
  }) => {
    const [aspectRatio, setAspectRatio] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleImageLoad = useCallback((event: NativeSyntheticEvent<ImageLoadEventData>) => {
      setLoading(true);
      const { width, height } = event.nativeEvent.source;
      const imageAspectRatio = width / (height || 1);
      setAspectRatio(imageAspectRatio);
      setLoading(false);
    }, []);

    return (
      <TouchableWithoutFeedback
        style={{ width: '100%', height: '100%' }}
        onPress={() => {
          //@ts-ignore
          navigation.navigate('ViewerImage', { uri, caption });
        }}
      >
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Image
            style={{ aspectRatio, width, height }}
            source={{ uri }}
            onLoad={handleImageLoad}
            progressiveRenderingEnabled
          />
        )}
      </TouchableWithoutFeedback>
    );
  }
);
