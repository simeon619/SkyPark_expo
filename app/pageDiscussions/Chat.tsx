import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

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
import { useListUserStore } from '../../managementState/server/Listuser';
import { HOST } from '../../constants/Value';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import { useMessageStore } from '../../managementState/server/Discussion';
import { AccountInterface, ProfileInterface } from '../../managementState/server/Descriptions';
import { NavigationProps } from '../../types/navigation';

const Chat = ({ route, navigation }: NavigationProps) => {
  const { listAccount, setListAccount } = useListUserStore((state) => state);

  const { setFocusedUser } = useMessageStore((state) => state);
  const [conversations, setConversations] = useState<typeof user>([]);
  const colorScheme = useColorScheme();
  const { primaryColour } = useToggleStore((state) => state);
  const { ctxMenu } = useMenuDiscussionIsOpen((state) => state);
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

  useEffect(() => {
    setListAccount();
  }, []);

  const handleCurrentConversation = ({
    account,
    profile,
  }: {
    account: AccountInterface | undefined;
    profile: ProfileInterface | undefined;
  }) => {
    if (account && profile) {
      setFocusedUser({ account, profile });

      navigation.navigate('Discussion');
    } else {
      console.error('erreur');
    }
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={listAccount}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: verticalScale(50),
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      renderItem={({ item: conversation, index }) => (
        <TouchableOpacity
          disabled={ctxMenu}
          onPress={() => handleCurrentConversation({ account: conversation?.account, profile: conversation?.profile })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderBottomColor: Colors[colorScheme ?? 'light'].grey,
            borderBottomWidth: 1,
          }}
        >
          {/* <Image
            source={ { uri: HOST +  conversation?.profile.imgProfile[0].url }}
            style={{
              width: moderateScale(45),
              aspectRatio: 1,
              borderRadius: 25,
            }}
          /> */}

          <ImageProfile image={conversation?.profile.imgProfile[0]?.url} size={moderateScale(55)} />

          <View
            style={{
              flex: 1,
              paddingHorizontal: horizontalScale(10),
              alignSelf: 'stretch',
              justifyContent: 'space-between',
            }}
          >
            <TextRegular style={{ fontSize: moderateScale(16) }}>{conversation?.account.name}</TextRegular>
            {/* <TextRegularItalic style={{ color: 'gray' }} numberOfLines={1}>
              {conversation.last_message.Owner && whatIconStatus(conversation.last_message.status)}
              {conversation.last_message.text}
            </TextRegularItalic> */}
          </View>
          <View
            style={{
              alignSelf: 'stretch',
              justifyContent: 'space-between',
            }}
          >
            {/* <TextMedium
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
            )} */}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default React.memo(Chat);
