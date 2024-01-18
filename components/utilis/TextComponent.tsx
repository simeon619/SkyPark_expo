import React, { useMemo, useState } from 'react';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import { TextLight, TextRegular, TextRegularItalic } from '../StyledText';
import { Pressable } from 'react-native';

import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { useNavigation } from '@react-navigation/native';
import { View } from '../Themed';
let EXCEED_LIMIT = 50;

const TextComponent = ({
  message,
  data,
  user,
}: {
  message: MessageInterface | undefined;
  data: PostInterface;
  user:
    | {
        account: AccountInterface;
        profile: ProfileInterface;
      }
    | undefined;
}) => {
  if (!message?.text) return null;
  const [moreText] = useState(false);
  const navigation = useNavigation();

  const [textIsExpandable, setTextIsExpandable] = useState(false);
  const { primaryColour } = useToggleStore((state) => state);

  useMemo(() => {
    setTextIsExpandable(message?.text.length > EXCEED_LIMIT);
  }, [message?.text]);
  function handleGoToDetail(): void {
    const dataPost = JSON.stringify(data);
    const infoUser = JSON.stringify(user);
    const messageUser = JSON.stringify(message);
    //@ts-ignore
    navigation.push('DetailPost', { dataPost, infoUser, messageUser, id: data._id });
  }
  return (
    <View>
      <Pressable onPress={handleGoToDetail}>
        <TextRegular
          numberOfLines={textIsExpandable ? (moreText ? undefined : 2) : undefined}
          style={{
            fontSize: moderateScale(14),
            paddingHorizontal: horizontalScale(10),
          }}
        >
          {message?.text}
        </TextRegular>
        {textIsExpandable && (
          <TextLight
            style={{ fontSize: moderateScale(14), color: primaryColour, paddingHorizontal: horizontalScale(10) }}
          >
            voir plus
          </TextLight>
        )}
      </Pressable>
    </View>
  );
};

export default TextComponent;
