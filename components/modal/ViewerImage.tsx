import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
// import Gallery from "react-native-awesome-gallery";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TextRegular } from "../StyledText";

interface Props {
  images: { uri: string }[];
  initialIndex?: number;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex = 0, onClose }: Props) => {
  const [infoVisible, setInfoVisible] = useState(true);
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>

      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInDown.duration(0) : undefined}
          exiting={FadeOutDown.duration(0)}
          style={{
            paddingBottom: bottom + 8,
            position: "absolute",
            bottom: 0,
            zIndex: 10,
            width: "100%",
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            paddingHorizontal: 6,
            paddingTop: 6,
          }}
        >
          <TextRegular style={{ color: "#ffe" }}>
            {images[index]?.uri}
          </TextRegular>
        </Animated.View>
      )}
    </View>
  );
};
