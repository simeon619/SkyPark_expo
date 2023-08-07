import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

const shadow = (elevation: number) => {
  if (Platform.OS === "ios") {
    return {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.14,
      shadowRadius: elevation / 2,
    };
  } else {
    return {
      shadowOffset: {
        width: 0,
        height: 11,
      },
      shadowOpacity: 0.15,
      shadowRadius: 14.78,
      shadowColor: "#000",
      elevation: elevation,
    };
  }
};
export { horizontalScale, moderateScale, shadow, verticalScale };
