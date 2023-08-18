import React from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextLight } from '../StyledText';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';

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

  return (
    <TextLight
      style={{
        fontSize: moderateScale(15),
        color: '#000c',
        paddingRight: horizontalScale(10),
        paddingTop: verticalScale(5),
      }}
    >
      {message?.text}
    </TextLight>
  );
};

export default TextComponent;
