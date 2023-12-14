import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { getTypeFile } from '../../Utilis/functions/media/extension';
import { horizontalScale, moderateScale } from '../../Utilis/metrics';
import { MessageWithFileAndStatus, getMessages } from '../../Utilis/models/Chat/messageReposotory';
import { UserSchema } from '../../Utilis/models/Chat/userRepository';
import { useMenuDiscussionIsOpen } from '../../managementState/client/preference';
import eventEmitter, { EventMessageType } from '../../managementState/event';
import { useAuthStore } from '../../managementState/server/auth';
import { TextLight, TextMedium, TextRegular } from '../StyledText';
import ImageProfile from '../utilis/simpleComponent/ImageProfile';

const ItemChat = ({ conversation }: { conversation: UserSchema }) => {
  const { ctxMenu } = useMenuDiscussionIsOpen((state) => state);
  const [lastMessage, setLastMessge] = useState<MessageWithFileAndStatus>();

  const navigation = useNavigation();

  useEffect(() => {
    const handleReiveMessage = async () => {
      let messages = (await getMessages(1, 1, conversation.idConversation))[0];
      setLastMessge(messages);
    };
    eventEmitter.on(EventMessageType.receiveMessage + conversation.idConversation, handleReiveMessage);
    return () => {
      eventEmitter.removeListener(EventMessageType.receiveMessage + conversation.idConversation, handleReiveMessage);
    };
  }, []);

  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    const initLastMessage = async () => {
      let message = await getMessages(1, 1, conversation.idConversation);
      setLastMessge(message[0]);
    };

    initLastMessage();
  });

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
        // borderBottomColor: Colors[colorScheme ?? 'light'].grey,
        // borderBottomWidth: 1,
      }}
    >
      <ImageProfile image={conversation?.urlPic} size={moderateScale(55)} />

      <View
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(10),
          alignSelf: 'stretch',
          justifyContent: 'space-between',
        }}
      >
        <TextRegular style={{ fontSize: moderateScale(16) }}>{conversation?.nomUtilisateur}</TextRegular>
        <ViewLastMessage last={lastMessage} />
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
          {/* {Boolean(lastMessage?.statusData.dateEnvoye) && formatMessageDate(lastMessage?.statusData.dateEnvoye || 0)} */}
        </TextMedium>

        {!(lastMessage?.newMessage.idExpediteur == account?._id) && (
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
const ViewLastMessage = ({ last }: { last: MessageWithFileAndStatus | undefined }) => {
  if (!last) {
    return <TextLight>Envoyez votre premier message</TextLight>;
  }

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
  return (
    <>
      <View style={{ flexDirection: 'row' }}>
        {whatIconStatus({
          send: last.statusData.dateEnvoye,
          received: last.statusData.dateReçu,
          seen: last.statusData.dateLu,
        })}

        <View style={{ flexDirection: 'row' }}>
          <TextLight numberOfLines={1}>{last.newMessage.contenuMessage}</TextLight>

          {getTypeFile(last?.filesData?.[0]?.extension) === 'image' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="image" size={18} color="grey" />
              <TextLight> Photo</TextLight>
            </View>
          )}

          {getTypeFile(last?.filesData?.[0]?.extension) === 'video' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="videocam" size={20} color="grey" />
              <TextLight>Video</TextLight>
            </View>
          )}

          {getTypeFile(last?.filesData?.[0]?.extension) === 'audio' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="mic" size={20} color="blue" />
              <TextLight>Audio</TextLight>
            </View>
          )}
        </View>
      </View>
    </>
  );
};
