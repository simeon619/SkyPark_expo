import { ArrayData, FileType, InstanceInterface } from '../../lib/SQueryClient';
import { SQuery } from '../../managementState';
import eventEmitter, { EventMessageType } from '../../managementState/event';
import { useAuthStore } from '../../managementState/server/auth';
import {
  createMessageWithStatusAndFiles,
  createPrivateConversation,
  getConversationIdByDestinataire,
  updateStatutMessage,
} from '../models/Chat/messageReposotory';

export function mergeArrayData<T extends InstanceInterface>(
  existingData: ArrayData<T>,
  newData: Partial<ArrayData<T>>,
  isUpdated?: boolean
) {
  const uniqueIds = new Set(existingData?.items.map((item) => item._id));
  const mergedItems = existingData?.items.slice() || [];

  newData?.items?.forEach((newItem) => {
    if (!uniqueIds.has(newItem._id)) {
      uniqueIds.add(newItem._id);
      mergedItems.push(newItem);
    } else if (isUpdated) {
      const index = mergedItems.findIndex((item) => item._id === newItem._id);
      if (index !== -1) {
        mergedItems[index] = newItem;
      }
    }
  });
  return {
    items: mergedItems,
    hasNextPage: newData?.hasNextPage || false,
    totalItems: newData?.totalItems || 0,
    totalPages: newData?.totalPages || 0,
    pagingCounter: newData?.pagingCounter || 0,
    nextPage: newData?.nextPage || 0,
    page: newData?.page || 0,
    limit: newData?.limit || 0,
    added: newData?.added || [],
    removed: newData?.removed || [],
    hasPrevPage: newData?.hasPrevPage || false,
    prevPage: newData?.prevPage || 0,
  };
}

export const getDiscussionId = async (receiverId: string | undefined) => {
  if (!receiverId) return;
  let discussionId = await getConversationIdByDestinataire(receiverId);

  if (!discussionId) {
    try {
      const res = await SQuery.service('messenger', 'createDiscussion', {
        receiverAccountId: receiverId,
      });
      if (res.response?.id) {
        await createPrivateConversation({
          ID_Conversation: res.response.id,
          ID_DESTINATAIRE: receiverId,
          Type_Conversation: 'private',
        });
        discussionId = res.response.id;
      } else {
        console.error('Failed to create discussion:', res);
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
    }
  }

  return discussionId;
};
export const getChannel = async (discussionId: string | undefined | null) => {
  if (!discussionId) return;
  const discussion = await SQuery.newInstance('discussion', { id: discussionId });
  const ArrayDiscussion = await discussion?.channel;

  ArrayDiscussion?.when(
    'update',
    async (obj) => {
      let messageId = obj?.added[0];

      if (!messageId) return;

      let messageInstance = await SQuery.newInstance('message', { id: messageId });

      if (!messageInstance) return;

      let newMessage = messageInstance.$cache;

      if (newMessage.account !== useAuthStore.getState().account?._id) {
        let files =
          newMessage.files?.map((file) => {
            return {
              extension: file.extension,
              size: file.size,
              url: file.url,
            };
          }) || [];

        await createMessageWithStatusAndFiles(
          {
            Contenu_Message: newMessage.text,
            Horodatage: newMessage.__createdAt,
            ID_Message: newMessage._id,
            ID_Conversation: discussionId || '',
            ID_Expediteur: newMessage.account,
          },
          { Date_Reçu: Date.now(), ID_Message: messageId, Date_Envoye: newMessage.__createdAt },
          files
        );
        eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
      }
    },
    'receiveMessage:' + discussionId
  );
  return ArrayDiscussion;
};

export const sendServer = async (
  discussionId: string,
  accountId: string,
  messageId: string,
  files?: FileType[],
  value?: string
) => {
  let channel = await getChannel(discussionId);

  let messageAdd = await channel?.update({
    addNew: [
      {
        account: accountId,
        text: value,
        files: files,
      },
    ],
  });

  if (messageAdd?.added[0]) {
    let messageInstance = await SQuery.newInstance('message', { id: messageAdd?.added[0] });

    if (!messageInstance) return;

    updateStatutMessage({ ID_Message: messageId, Date_Envoye: messageInstance?.__createdAt });

    eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
  }
};
export const putMessageLocal = async (
  files: FileType[] | undefined,
  value: string | undefined,
  discussionId: string,
  accountId: string,
  messageId: string,
  createMsg: number
) => {
  try {
    let fileMap =
      files?.map((file) => {
        return {
          ...file,
          extension: file.type.split('/')[1],
          uri: file.uri,
          url: undefined,
          buffer: undefined,
        };
      }) || [];
    await createMessageWithStatusAndFiles(
      {
        Contenu_Message: value || null,
        Horodatage: createMsg,
        ID_Message: messageId,
        ID_Conversation: discussionId,
        ID_Expediteur: accountId,
      },
      {},
      fileMap
    );

    eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
  } catch (error) {
    console.error('Error put in local message:', error);
  }
};
