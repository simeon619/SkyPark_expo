import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';

import Animated from 'react-native-reanimated';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { TextLight, TextLightItalic } from '../StyledText';
import { View } from '../Themed';
import { TouchableOpacity } from 'react-native';
import { LabelInterface, SurveyInterface } from '../../managementState/server/Descriptions';
import { SQuery } from '../../managementState';
import { calculeDateEnd } from '../../Utilis/date';

const SurveyComponent = ({
  dataSurvey,
  question,
  postId,
}: {
  dataSurvey: (SurveyInterface & { labels: LabelInterface[] }) | undefined;
  question: string | undefined;
  postId: string;
}) => {
  if (!dataSurvey) return <></>;

  const [hasVoted, setHasVoted] = useState(true);


  const computeTotal = () => {
    if (dataSurvey) {
      return dataSurvey.labels.reduce((a, b) => a + b.votes, 0);
    }
    return 0;
  };

  useEffect(() => {});

  const handleVote = async (item: LabelInterface) => {
    const dataSurveyA = await SQuery.service('post', 'survey', {
      labelId: item._id,
      postId: postId,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        rowGap: horizontalScale(7),
        ...shadow(1),
        borderColor: '#0001',
        borderWidth: 1,
        borderRadius: 15,
        overflow: 'hidden',
        padding: moderateScale(10),
      }}
    >
      {/* <TextComponent  /> */}
      <TextLightItalic>{question}</TextLightItalic>
      {dataSurvey.labels.map((item, index, arr) => {
        const computeTotal = arr.reduce((a, b) => a + b.votes, 0);
        let percentage = ((item.votes * 100) / computeTotal).toFixed(1);
        percentage = percentage === 'NaN' ? '0' : percentage;

        return (
          <TouchableOpacity key={index} onPress={() => handleVote(item)} style={{ paddingVertical: verticalScale(0) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: horizontalScale(10) }}>
              {hasVoted ? (
                <TextLight style={{ fontSize: moderateScale(16), color: '#777' }}>{percentage} %</TextLight>
              ) : null}
              <TextLight style={{ fontSize: moderateScale(15) }}>{item.label}</TextLight>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                columnGap: horizontalScale(10),
                paddingRight: horizontalScale(35),
              }}
            >
              <View
                style={{
                  width: moderateScale(17),
                  aspectRatio: 1,
                  borderWidth: 1,
                  borderRadius: 50,
                  backgroundColor: hasVoted ? '#3F21B8' : '#3F21B800',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {hasVoted ? <AntDesign name="check" size={moderateScale(15)} color="white" /> : null}
              </View>
              <Animated.View
                //@ts-ignore
                style={{
                  height: verticalScale(7),
                  width: `${percentage}%`,
                  backgroundColor: '#3F21B8',
                  borderRadius: 10,
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopColor: '#0001',
          borderTopWidth: 1,
        }}
      >
        <TextLight style={{ fontSize: moderateScale(15), opacity: hasVoted ? 1 : 0 }}>
          {computeTotal()} vote{computeTotal() > 1 ? 's' : ''}{' '}
        </TextLight>
        <TextLight>
          <TextLight>{calculeDateEnd(dataSurvey.__createdAt + dataSurvey.delay)}</TextLight>
        </TextLight>
      </View>
    </View>
  );
};

export default SurveyComponent;
