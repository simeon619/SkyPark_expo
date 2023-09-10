import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, useColorScheme } from 'react-native';
import { verticalScale } from '../../Utilis/metrics';

import { UserSchema, getAllUsers } from '../../Utilis/models/Chat/userRepository';
import ItemChat from '../../components/discussion/ItemChat';
import Colors from '../../constants/Colors';
import { setListAccount } from '../../managementState/server/Listuser';
import { RefreshControl } from 'react-native';

const Chat = () => {
  // const { listAccount, setListAccount } = useListUserStore((state) => state);

  // const { setFocusedUser } = useMessageStore((state) => state);
  const colorScheme = useColorScheme();

  const [users, setUsers] = useState<Record<string, UserSchema>>({});
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [pageNumber]);
  const fetchUsers = async () => {
    if (!hasMoreUsers) {
      return;
    }
    let valid = await setListAccount();
    let test = valid?.some((v) => v === 1);
    if (test) {
      const newUsers = await getAllUsers(pageNumber, itemsPerPage);
      if (newUsers.length === 0) {
        setHasMoreUsers(false);
        return;
      }
      setUsers((prev) => {
        const newObjet: Record<string, UserSchema> = {};
        newUsers.forEach((user) => {
          newObjet[user.ID_Utilisateur] = user;
        });
        return {
          ...prev,
          ...newObjet,
        };
      });
    }
  };

  const loadMoreUsers = () => {
    setPageNumber(pageNumber + 1);
  };
  const usersArray = useMemo(() => Object.values(users), [users]);

  return (
    <FlatList
      style={{ flex: 1 }}
      data={usersArray}
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
