import { useNavigation } from '@react-navigation/native';
import React, { memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  Image,
  ImageLoadEventData,
  NativeSyntheticEvent,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { HOST } from '../../constants/Value';
import { UrlData } from '../../lib/SQueryClient';
import { View } from '../Themed';
import { moderateScale, shadow } from '../../Utilis/metrics';
import { TextLight } from '../StyledText';

const MediaComponent = ({ media, caption }: { media: UrlData[] | undefined; caption: string | undefined }) => {
  if (!media) {
    return null;
  }
  const numberMedia = media?.length;

  switch (numberMedia) {
    case 1:
      return <OnePicture uri={media[0].url} caption={caption} />;
    case 2:
      return <TwoPictures uri={[media[0].url, media[1].url]} caption={caption} />;
    // case 3:
    //   return <ThreePictures uri={[media[0].url, media[1].url, media[2].url]} caption={caption} />;

    case 4:
      return <FourPictures uri={[media[0].url, media[1].url, media[2].url, media[3].url]} caption={caption} />;
    default:
      return <TextLight>Composant par défaut</TextLight>;
  }
};
export default MediaComponent;

const ImageComponent = memo(
  ({ uri, caption, width }: { uri: string; width?: DimensionValue; height?: DimensionValue; caption: string }) => {
    const [aspectRatio, setAspectRatio] = useState(1);
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
      <Pressable
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
          <Image style={{ width, aspectRatio, alignSelf: 'center' }} source={{ uri }} onLoad={handleImageLoad} />
        )}
      </Pressable>
    );
  }
);

const ImageComponent1 = memo(({ uri, caption }: { uri: string; caption: string }) => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        //@ts-ignore
        navigation.navigate('ViewerImage', { uri, caption });
      }}
    >
      <Image style={{ width: '100%', height: '100%', alignSelf: 'center' }} source={{ uri }} />
    </Pressable>
  );
});

export const OnePicture = ({ uri, caption }: { uri: string; caption: string | undefined }) => {
  const { height } = useWindowDimensions();
  return (
    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View
        // key={index}
        style={{
          width: '99%',
          maxHeight: height * 0.62,
          overflow: 'hidden',
          borderRadius: moderateScale(20),
          ...shadow(5),
        }}
      >
        <ImageComponent
          height={'100%'}
          width={'100%'}
          uri={uri.includes('http') ? uri : HOST + uri}
          caption={caption || ''}
        />
      </View>
    </View>
  );
};

export const TwoPictures = ({ uri, caption }: { uri: string[]; caption: string | undefined }) => {
  const { height } = useWindowDimensions();

  return (
    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {uri.map((url, index) => (
        <View
          key={index}
          style={{
            width: '48%',
            maxHeight: height * 0.42,
            overflow: 'hidden',
            borderRadius: moderateScale(20),
            ...shadow(5),
          }}
        >
          <ImageComponent
            height={'100%'}
            width={'100%'}
            uri={url.includes('http') ? url : HOST + url}
            caption={caption || ''}
          />
        </View>
      ))}
    </View>
  );
};

export const FourPictures = ({ uri, caption }: { uri: string[]; caption: string | undefined }) => {
  const { height } = useWindowDimensions();

  return (
    <View
      style={{
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <View
        // key={index}
        style={{
          width: '99%',
          maxHeight: height * 0.2,
          overflow: 'hidden',
          borderRadius: moderateScale(20),
          ...shadow(5),
        }}
      >
        <ImageComponent1 uri={uri[0].includes('http') ? uri[0] : HOST + uri[0]} caption={caption || ''} />
      </View>

      {[1, 2, 3].map((_url, index) => (
        <View
          key={index}
          style={{
            width: '31%',
            height: height * 0.15,
            maxHeight: height * 0.2,
            overflow: 'hidden',
            borderRadius: moderateScale(20),
            ...shadow(5),
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <ImageComponent1
            uri={uri[index + 1].includes('http') ? uri[index + 1] : HOST + uri[index + 1]}
            caption={caption || ''}
          />
        </View>
      ))}
    </View>
  );
};
