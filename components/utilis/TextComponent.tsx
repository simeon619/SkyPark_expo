import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { moderateScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import { TextLight } from '../StyledText';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
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
  const [moreText, setMoreText] = useState(false);
  const [textIsExpandable, setTextIsExpandable] = useState(false);
  const { primaryColour } = useToggleStore((state) => state);
  const route = useRouter();
  const toggleMoreText = () => {
    setMoreText((prev) => !prev);
  };

  useEffect(() => {
    setTextIsExpandable(message?.text.length > EXCEED_LIMIT);
  }, [message?.text]);
  function handleGoToDetail(): void {
    // router.push({ pathname: 'pageModal/ViewerImage', params: { uri, caption } })
    const dataPost = JSON.stringify(data);
    const infoUser = JSON.stringify(user);
    const messageUser = JSON.stringify(message);
    //@ts-ignore
    route.push({ pathname: 'pageModal/detailPost', params: { dataPost, infoUser, messageUser } });
  }
  return (
    <Pressable onPress={handleGoToDetail}>
      <TextLight
        numberOfLines={textIsExpandable ? (moreText ? undefined : 3) : undefined}
        style={{
          fontSize: moderateScale(15),
          color: '#000',
          // textAlign: "left",
          // paddingHorizontal: horizontalScale(10),
        }}
      >
        {message?.text}
      </TextLight>
      {textIsExpandable && (
        <TouchableOpacity>
          <TextLight style={{ fontSize: moderateScale(15), color: primaryColour }}>
            {moreText ? 'Voir Moins' : 'Voir Plus'}
          </TextLight>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default TextComponent;
