//@ts-nocheck
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';

import Animated from 'react-native-reanimated';
import { horizontalScale, moderateScale, shadow, verticalScale } from '../../Utilis/metrics';
import { SurveySchema } from '../../types/PostType';
import { TextLight } from '../StyledText';
import { View } from '../Themed';
import TextComponent from './TextComponent';

const SurveyComponent = ({
  dataSurvey,
  question,
}: {
  dataSurvey: SurveySchema | undefined;
  question: string | undefined;
}) => {
  if (!dataSurvey) return null;

  //ici on aura plus tard une liste venant du serveur qui renvera true ou false en fonction de si l'user a voté ou non
  const [hasVoted, setHasVoted] = useState(false);
  const [dataSurveyA, setDataSurveyA] = useState(dataSurvey);

  const handleVote = (item: any) => {
    if (!hasVoted) {
      setHasVoted(true);

      const updatedOptions = [...dataSurveyA.options];
      const index = updatedOptions.findIndex((option) => option.id === item.id);
      if (index !== -1) {
        updatedOptions[index] = { ...item, votes: item.votes + 1 };
      }

      setDataSurveyA({ ...dataSurveyA, options: updatedOptions, totalVotes: dataSurveyA.totalVotes + 1 });
    }
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
      <TextComponent text={question} />
      {dataSurveyA.options.map((item, index) => {
        let percentage = ((item.votes * 100) / dataSurveyA.totalVotes).toFixed(1);
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

      <TextLight style={{ fontSize: moderateScale(15), opacity: hasVoted ? 1 : 0 }}>
        {dataSurveyA.totalVotes} vote{dataSurveyA.totalVotes > 1 ? 's' : ''}{' '}
      </TextLight>
    </View>
  );
};

export default SurveyComponent;
