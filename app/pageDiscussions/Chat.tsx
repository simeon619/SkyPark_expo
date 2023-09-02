import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { horizontalScale, moderateScale, verticalScale } from '../../Utilis/metrics';

import { UserSchema, getAllUsers } from '../../Utilis/models/Chat/userRepository';
import { TextRegular } from '../../components/StyledText';
import { View } from '../../components/Themed';
import ImageProfile from '../../components/utilis/simpleComponent/ImageProfile';
import Colors from '../../constants/Colors';
import { useMenuDiscussionIsOpen } from '../../managementState/client/preference';
import { useMessageStore } from '../../managementState/server/Discussion';

const Chat = () => {
  // const { listAccount, setListAccount } = useListUserStore((state) => state);

  const { setFocusedUser } = useMessageStore((state) => state);
  const colorScheme = useColorScheme();
  const { ctxMenu } = useMenuDiscussionIsOpen((state) => state);

  const [users, setUsers] = useState<UserSchema[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const navigation = useNavigation();
  const itemsPerPage = 10;

  // const whatIconStatus = useCallback(
  //   ({ send, received, seen }: { send: number | null; received: number | null; seen: number | null }) => {
  //     if (received && seen) {
  //       return <Ionicons name="checkmark-done-outline" size={18} color="blue" />;
  //     } else if (received) {
  //       return <Ionicons name="checkmark-done-outline" size={18} color="grey" />;
  //     } else if (send) {
  //       return <Ionicons name="checkmark-outline" size={18} color="grey" />;
  //     } else return <Ionicons name="remove-circle-outline" size={16} color="grey" />;
  //   },
  //   []
  // );

  useEffect(() => {
    fetchUsers();
  }, [pageNumber]);
  const fetchUsers = async () => {
    if (!hasMoreUsers) {
      return;
    }

    const newUsers = await getAllUsers(pageNumber, itemsPerPage);
    if (newUsers.length === 0) {
      setHasMoreUsers(false);
      return;
    }

    setUsers([...users, ...newUsers]);
  };

  const loadMoreUsers = () => {
    setPageNumber(pageNumber + 1);
  };

  const handleCurrentConversation = (InfoUserConv: UserSchema) => {
    if (InfoUserConv) {
      //@ts-ignore
      navigation.navigate('Discussion', { data: InfoUserConv });
    } else {
      console.error('erreur');
    }
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={users}
      keyExtractor={(item) => item.ID_Utilisateur}
      onEndReached={loadMoreUsers}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: verticalScale(50),
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      renderItem={({ item: conversation }) => (
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

export default Chat;
