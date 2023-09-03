import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, useColorScheme } from 'react-native';
import { formatMessageDate } from '../../Utilis/date';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import { MessageWithFileAndStatus, getMessages } from '../../Utilis/models/Chat/messageReposotory';
import { UserSchema } from '../../Utilis/models/Chat/userRepository';
import Colors from '../../constants/Colors';
import useToggleStore, { useMenuDiscussionIsOpen } from '../../managementState/client/preference';
import eventEmitter, { EventMessageType } from '../../managementState/event';
import { useAuthStore } from '../../managementState/server/auth';
import { TextMedium, TextRegular, TextRegularItalic } from '../StyledText';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';
import { useNavigation } from '@react-navigation/native';

const ItemChat = ({ conversation }: { conversation: UserSchema }) => {
  console.log('🚀 ~ file: ItemChat.tsx:17 ~ ItemChat ~ conversation:', conversation);
  const { ctxMenu } = useMenuDiscussionIsOpen((state) => state);
  const [lastMessage, setLastMessge] = useState<MessageWithFileAndStatus>();

  const navigation = useNavigation();

  useEffect(() => {
    eventEmitter.on(EventMessageType.receiveMessage + conversation.ID_Conversation, async () => {
      let messages = (await getMessages(1, 1, conversation.ID_Conversation || ''))[0];
      setLastMessge(messages);
    });
    return () => {
      eventEmitter.removeAllListeners(EventMessageType.receiveMessage + conversation.ID_Conversation);
    };
  }, []);

  const account = useAuthStore((state) => state.account);
  const { primaryColour } = useToggleStore((state) => state);

  const whatIconStatus = useCallback(
    ({
      send,
      received,
      seen,
    }: {
      send: number | null | undefined;
      received: number | null | undefined;
      seen: number | null | undefined;
    }) => {
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
    const initLastMessage = async () => {
      let message = await getMessages(1, 1, conversation.ID_Conversation || '');
      setLastMessge(message[0]);
    };

    initLastMessage();
  }, []);
  const colorScheme = useColorScheme();
  const handleCurrentConversation = (InfoUserConv: UserSchema) => {
    if (InfoUserConv) {
      //@ts-ignore
      navigation.navigate('Discussion', { data: InfoUserConv });
    } else {
      console.error('erreur');
    }
  };

  return (
    <TouchableOpacity
      disabled={ctxMenu}
      onPress={() => handleCurrentConversation(conversation)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: Colors[colorScheme ?? 'light'].grey,
        borderBottomWidth: 1,
      }}
    >
      <ImageProfile image={conversation?.Url_Pic} size={moderateScale(55)} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(10),
          alignSelf: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        <TextRegular style={{ fontSize: moderateScale(16) }}>{conversation?.Nom_Utilisateur}</TextRegular>
        <TextRegularItalic style={{ color: 'gray' }} numberOfLines={1}>
          {lastMessage?.ID_Expediteur == account?._id &&
            whatIconStatus({
              received: lastMessage?.Date_Reçu,
              seen: lastMessage?.Date_Lu,
              send: lastMessage?.Date_Envoye,
            })}
          {!!lastMessage?.files && lastMessage?.files.length} {!!lastMessage?.files && lastMessage?.files[0].extension}{' '}
          {lastMessage?.Contenu_Message}
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
          {formatMessageDate(lastMessage?.Date_Reçu || 0)}
        </TextMedium>

        {!(lastMessage?.ID_Expediteur == account?._id) && (
          <></>
          // <TextMedium
          //   style={{
          //     color: '#fff',
          //     alignSelf: 'center',
          //     backgroundColor: primaryColour,
          //     padding: moderateScale(3),
          //     borderRadius: 99,
          //     // fontSize: moderateScale(14),
          //   }}
          // >
          //   {/* {Math.ceil(Math.random() * 2)} */}
          // </TextMedium>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemChat;
