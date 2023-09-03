import React, { useEffect, useState } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { verticalScale } from '../../Utilis/metrics';

import { UserSchema, getAllUsers } from '../../Utilis/models/Chat/userRepository';
import ItemChat from '../../components/discussion/ItemChat';
import Colors from '../../constants/Colors';

const Chat = () => {
  // const { listAccount, setListAccount } = useListUserStore((state) => state);

  // const { setFocusedUser } = useMessageStore((state) => state);
  const colorScheme = useColorScheme();

  const [users, setUsers] = useState<UserSchema[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const itemsPerPage = 10;

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

    setUsers((prev) => [...prev, ...newUsers]);
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
