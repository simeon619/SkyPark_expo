import { Image, ImageLoadEventData } from 'expo-image';
import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { HOST } from '../constants/Value';
const ImageRatio = ({ uri, ratio, url }: { uri?: string | undefined; ratio: number; url?: string | undefined }) => {
  const [aspectRatio, setAspectRatio] = useState(0.5);
  const { height } = useWindowDimensions();
  const handleImageLoad = (event: ImageLoadEventData) => {
    const { width, height } = event.source;
    const imageAspectRatio = width / (height || 1);
    setAspectRatio(imageAspectRatio);
  };
  const imageSource = !!url ? { uri: HOST + url } : { uri: uri };
  return (
    <Image
      contentFit="cover"
      source={imageSource}
      style={{
        width: '100%',
        maxHeight: height / ratio,
        aspectRatio: aspectRatio,
      }}
      onLoad={handleImageLoad}
      // transition={150}
    />
  );
};
export default ImageRatio;
