import { ArrayData, FileType, InstanceInterface } from '../../lib/SQueryClient';
import { SQuery } from '../../managementState';
import eventEmitter, { EventMessageType } from '../../managementState/event';
import { useAuthStore } from '../../managementState/server/auth';
import {
  createConversation,
  createMessage,
  getConversationIdByDestinataire,
  updateStatutMessage,
} from '../models/Chat/messageReposotory';

export function mergeArrayData<T extends InstanceInterface>(
  existingData: ArrayData<T>,
  newData: Partial<ArrayData<T>>,
  isUpdated?: boolean
) {
  const ArrayExistingItems = existingData?.items ?? [];
  // console.log('🚀 ~ file: utlisSquery.ts:18 ~ ArrayExistingItems:', ArrayExistingItems);
  const ArrayNewDataItems = newData?.items ?? [];
  // console.log('🚀 ~ file: utlisSquery.ts:20 ~ ArrayNewDataItems:', ArrayNewDataItems);

  const uniqueIds = new Set(ArrayExistingItems.map((item) => item._id));

  ArrayNewDataItems.forEach((newItem) => {
    if (!uniqueIds.has(newItem._id)) {
      uniqueIds.add(newItem._id);
      ArrayExistingItems?.push(newItem);
    } else if (isUpdated) {
      const index = ArrayExistingItems.findIndex((item) => item._id === newItem._id);
      if (index !== -1) {
        ArrayExistingItems[index] = newItem;
      }
    }
  });

  return {
    items: ArrayExistingItems,
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
        await createConversation({
          idConversation: res.response.id,
          idDestinataire: receiverId,
          typeConversation: 'private',
          idGroupe: null,
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
              buffer: null,
            };
          }) || [];

        await createMessage({
          newMessage: {
            contenuMessage: newMessage.text,
            horodatage: newMessage.__createdAt,
            idConversation: discussionId,
            idExpediteur: newMessage.account,
            idMessage: messageId,
          },
          filesData: files,
          statusData: {
            dateLu: null,
            dateReçu: Date.now(),
            dateEnvoye: newMessage.__createdAt,
            idStatutLecture: 1,
            idMessage: messageId,
          },
        });
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

    updateStatutMessage({ idMessage: messageId, dateEnvoye: messageInstance?.__createdAt }, discussionId);

    eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
  }
};
export const putMessageLocal = async (
  files: FileType[] | null,
  value: string | null,
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
          url: null,
          buffer: null,
        };
      }) || [];
    await createMessage({
      newMessage: {
        contenuMessage: value,
        horodatage: createMsg,
        idConversation: discussionId,
        idExpediteur: accountId,
        idMessage: messageId,
      },
      filesData: fileMap,
      statusData: {
        dateEnvoye: null,
        dateLu: null,
        dateReçu: null,
        idStatutLecture: 1,
        idMessage: messageId,
      },
    });

    eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
  } catch (error) {
    console.error('Error put in local message:', error);
  }
};
