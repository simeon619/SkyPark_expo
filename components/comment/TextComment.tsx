import React, { useEffect, useState } from 'react';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import useToggleStore from '../../managementState/client/preference';
import { TextLight } from '../StyledText';
import { Pressable } from 'react-native';

import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { useNavigation } from '@react-navigation/native';
import { useCommentPostStore } from '../../managementState/server/post/commentStore';
import { ArrayDataInit } from '../../lib/SQueryClient';
let EXCEED_LIMIT = 10;

const TextComment = ({
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
  const navigation = useNavigation();

  const [textIsExpandable, setTextIsExpandable] = useState(false);
  useEffect(() => {
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
    <Pressable onPress={handleGoToDetail} style={{ paddingLeft: horizontalScale(60) }}>
      <TextLight
        numberOfLines={textIsExpandable ? (moreText ? undefined : 3) : undefined}
        style={{
          fontSize: moderateScale(15),
          backgroundColor: '#0001',

          padding: moderateScale(5),
          borderRadius: moderateScale(15),

          // textAlign: "left",
          // paddingHorizontal: horizontalScale(10),
        }}
      >
        {message?.text}
      </TextLight>
      {textIsExpandable && (
        <TextLight
          style={{
            fontSize: moderateScale(15),
            // backgroundColor: 'grey',
            // padding: moderateScale(5),
            // borderRadius: moderateScale(15),
          }}
        >
          {'Voir Plus'}
        </TextLight>
      )}
    </Pressable>
  );
};

export default TextComment;
