import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
let EXCEED_LIMIT = 250;
const TextComponent = ({ text }: { text: string | undefined }) => {
  if (!text) return null;
  const [moreText, setMoreText] = useState(false);
  const [textIsExpandable, setTextIsExpandable] = useState(false);
  const { primaryColour } = useToggleStore((state) => state);

  const toggleMoreText = () => {
    setMoreText((prev) => !prev);
  };

  useEffect(() => {
    setTextIsExpandable(text.length > EXCEED_LIMIT);
  }, [text]);
  return (
    <View>
      <TextLight
        numberOfLines={textIsExpandable ? (moreText ? undefined : 3) : undefined}
        style={{
          fontSize: moderateScale(15),
          color: '#000',
          // textAlign: "left",
          // paddingHorizontal: horizontalScale(10),
        }}
      >
        {text}
      </TextLight>
      {textIsExpandable && (
        <TouchableOpacity onPress={toggleMoreText}>
          <TextLight style={{ fontSize: moderateScale(15), color: primaryColour }}>
            {moreText ? 'Voir Moins' : 'Voir Plus'}
          </TextLight>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextComponent;
