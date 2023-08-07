import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formatMessageDate } from '../../Utilis/date';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';
import { TextMedium, TextRegular, TextRegularItalic } from '../../components/StyledText';
import { View } from '../../components/Themed';
import Colors from '../../constants/Colors';
import useToggleStore, { useMenuDiscussionIsOpen } from '../../managementState/client/preference';
import user from '../../user.json';

const Chat = () => {
  const [conversations, setConversations] = useState<typeof user>([]);
  const colorScheme = useColorScheme();
  const { primaryColour } = useToggleStore((state) => state);
  const { ctxMenu } = useMenuDiscussionIsOpen((state) => state);
  const router = useRouter();
  useEffect(() => {
    setConversations(() => user);
  }, []);

  const whatIconStatus = useCallback(
    ({ send, received, seen }: { send: number | null; received: number | null; seen: number | null }) => {
      if (received && seen) {
        return <Ionicons name="checkmark-done-outline" size={18} color="blue" />;
      } else if (received) {
        return <Ionicons name="checkmark-done-outline" size={18} color="grey" />;
      } else if (send) {
        return <Ionicons name="checkmark-outline" size={18} color="grey" />;
      } else return <Ionicons name="remove-circle-outline" size={16} color="grey" />;
    },
    []
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      data={conversations}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: verticalScale(50),
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      renderItem={({ item: conversation, index }) => (
        <TouchableOpacity
          disabled={ctxMenu}
          onPress={() => {
            router.push('/modal/discussion');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderBottomColor: Colors[colorScheme ?? 'light'].grey,
            borderBottomWidth: 1,
          }}
        >
          <Image
            source={{ uri: conversation.pic_user }}
            style={{
              width: moderateScale(45),
              aspectRatio: 1,
              borderRadius: 25,
            }}
          />

          <View
            style={{
              flex: 1,
              paddingHorizontal: horizontalScale(10),
              alignSelf: 'stretch',
              justifyContent: 'space-between',
            }}
          >
            <TextRegular style={{ fontSize: moderateScale(16) }}>{conversation.name}</TextRegular>
            <TextRegularItalic style={{ color: 'gray' }} numberOfLines={1}>
              {conversation.last_message.Owner && whatIconStatus(conversation.last_message.status)}
              {conversation.last_message.text}
            </TextRegularItalic>
          </View>
          <View
            style={{
              alignSelf: 'stretch',
              justifyContent: 'space-between',
            }}
          >
            <TextMedium
              style={{
                color: 'gray',
                alignSelf: 'flex-start',
                fontSize: moderateScale(12),
              }}
            >
              {formatMessageDate(conversation.last_message.date)}
            </TextMedium>
            {!conversation.last_message.Owner && (
              <TextMedium
                style={{
                  color: '#fff',
                  alignSelf: 'center',
                  backgroundColor: primaryColour,
                  padding: moderateScale(3),
                  borderRadius: 99,
                  fontSize: moderateScale(14),
                }}
              >
                {Math.ceil(Math.random() * 2)}
              </TextMedium>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default React.memo(Chat);
