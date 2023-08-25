import { useState, useEffect } from 'react';
import {
  AccountInterface,
  MessageInterface,
  PostInterface,
  ProfileInterface,
} from '../../managementState/server/Descriptions';
import { getInfoAccount, getMessagePost } from '../../managementState/server/post/postQuarter';

export const useInfoUserPost = ({ accountId }: { accountId: string | undefined }) => {
  const [infoUser, setInfoUser] = useState<{
    account: AccountInterface;
    profile: ProfileInterface;
  }>();
  useEffect(() => {
    const getData = async () => {
      const data = await getInfoAccount(accountId);
      setInfoUser(data);
    };
    getData();
  }, [accountId]);

  return infoUser;
};

export const useMessagePost = ({ dataPost }: { dataPost: PostInterface }) => {
  const [messages, setMessages] = useState<MessageInterface>();
  useEffect(() => {
    const getData = async () => {
      const data = await getMessagePost({ messageId: dataPost.message });
      setMessages(data);
    };

    getData();
  }, [dataPost]);

  return messages;
};
