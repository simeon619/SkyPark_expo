import React, { useEffect, useState } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { verticalScale } from '../../Utilis/metrics';

import { RefreshControl } from 'react-native-gesture-handler';
import { UserSchema, getAllUsers, readUser } from '../../Utilis/models/Chat/userRepository';
import ItemChat from '../../components/discussion/ItemChat';
import Colors from '../../constants/Colors';
import { setListAccount } from '../../managementState/server/Listuser';

const Chat = () => {
  // const { listAccount, setListAccount } = useListUserStore((state) => state);

  // const { setFocusedUser } = useMessageStore((state) => state);
  const colorScheme = useColorScheme();

  const [users, setUsers] = useState<UserSchema[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    // setListAccount();
    // fetchUsers();
  }, [pageNumber]);
  const fetchUsers = async () => {
    // if (!hasMoreUsers) {
    //   return;
    // }

    const t = await readUser('64ea9c0b03c6ae621b3e4951');
    if (!t) return;

    // const newUsers = await getAllUsers(pageNumber, itemsPerPage);
    // console.log('🚀 ~ file: Chat.tsx:30 ~ fetchUsers ~ newUsers:', newUsers);
    // if (newUsers.length === 0) {
    //   setHasMoreUsers(false);
    //   return;
    // }
    setUsers([t]);

    // setUsers((prev) => [...prev, ...newUsers]);
  };

  const loadMoreUsers = () => {
    setPageNumber(pageNumber + 1);
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={users}
      keyExtractor={(item) => item.ID_Utilisateur}
      onEndReached={loadMoreUsers}
      refreshControl={<RefreshControl refreshing={false} onRefresh={fetchUsers} />}
      onEndReachedThreshold={0.5}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: verticalScale(50),
        backgroundColor: Colors[colorScheme ?? 'light'].background,
      }}
      renderItem={({ item }) => <ItemChat conversation={item} />}
    />
  );
};

export default Chat;
