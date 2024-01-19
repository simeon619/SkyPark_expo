import React from 'react';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextLight } from '../StyledText';
import { MessageInterface } from '../../managementState/server/Descriptions';
import { handleTextFormat } from '../utilis/TextComponent';

const TextComponent = ({
  message, // data,
  // user,
}: {
  message: MessageInterface | undefined;
  // data: PostInterface;
  // user:
  //   | {
  //       account: AccountInterface;
  //       profile: ProfileInterface;
  //     }
  //   | undefined;
}) => {
  if (!message?.text) return null;

  return (
    <TextLight
      style={{
        fontSize: moderateScale(15),
        paddingRight: horizontalScale(10),
        paddingTop: verticalScale(5),
      }}
    >
      {handleTextFormat(message?.text)}
    </TextLight>
  );
};

export default TextComponent;
