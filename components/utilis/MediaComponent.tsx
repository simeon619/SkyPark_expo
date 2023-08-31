import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  DimensionValue,
  Image,
  ImageProgressEventDataIOS,
  NativeSyntheticEvent,
  useWindowDimensions,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { horizontalScale, verticalScale } from '../../Utilis/metrics';
import { HOST } from '../../constants/Value';
import { UrlData } from '../../lib/SQueryClient';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
import ShadowImage from './ShadowImage';

const GAP_MEDIA = 10;
const MediaComponent = ({ media, caption }: { media: UrlData[] | undefined; caption: string | undefined }) => {
  if (!media) {
    return null;
  }

  const navigation = useNavigation();
  const numberMedia = media?.length;

  const ImageComponent = ({ uri, width, height }: { uri: string; width: DimensionValue; height: DimensionValue }) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          //@ts-ignore
          navigation.navigate('ViewerImage', { uri, caption });
        }}
      >
        <Image
          style={{ width, height }}
          source={{ uri }}
          onProgress={handleImageLoad}

          // priority={'high'}
          // transition={0}
          // allowDownscaling={true}
          // cachePolicy={'disk'}
        />
        <TextLight></TextLight>
      </TouchableWithoutFeedback>
    );
  };

  const handleImageLoad = (event: NativeSyntheticEvent<ImageProgressEventDataIOS>) => {};

  const { height } = useWindowDimensions();
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {numberMedia === 1 && (
        <ShadowImage
          ratioHeight={1}
          ratioWidth={100}
          children={<ImageComponent uri={HOST + media[0].url} width={'100%'} height={'100%'} />}
        />
      )}
      {numberMedia === 2 && (
        <View style={{ flexDirection: 'row', columnGap: horizontalScale(GAP_MEDIA) }}>
          {[0, 1].map((index) => (
            <ShadowImage
              key={index}
              ratioHeight={1}
              ratioWidth={48.5}
              children={<ImageComponent uri={HOST + media[index].url} width={'100%'} height={'100%'} />}
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
            children={<ImageComponent uri={media[0].url} width={'100%'} height={'100%'} />}
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
                children={<ImageComponent uri={media[index].url} width={'100%'} height={'100%'} />}
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
            children={<ImageComponent uri={media[0].url} width={'100%'} height={'100%'} />}
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
                children={<ImageComponent uri={media[index].url} width={'100%'} height={'100%'} />}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};
export default MediaComponent;
