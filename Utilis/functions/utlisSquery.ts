import { ArrayData, FileType, InstanceInterface } from '../../lib/SQueryClient';
import { SQuery } from '../../managementState';
import eventEmitter, { EventMessageType } from '../../managementState/event';
import { addStatutMessage, createMessageWithStatusAndFiles } from '../models/Chat/messageReposotory';

export function mergeArrayData<T extends InstanceInterface>(
  existingData: ArrayData<T>,
  newData: Partial<ArrayData<T>>
) {
  const uniqueIds = new Set(existingData?.items.map((item) => item._id));

  console.log({ existingData });

  newData?.items?.forEach((newItem) => {
    if (!uniqueIds.has(newItem._id)) {
      uniqueIds.add(newItem._id);
      existingData?.items.push(newItem);
    }
  });

  return {
    items: existingData?.items || [],
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

export const getDiscussionId = async (receiverId: string) => {
  const res = await SQuery.service('messenger', 'createDiscussion', {
    receiverAccountId: receiverId,
  });

  if (!res.response?.id) {
    console.error('getDiscussionId  : ' + res?.response?.id);
  }
  let discussionId = res.response?.id;

  return discussionId;
};

// let y = getDiscussionId('', true);

export const getChannel = async (discussionId: string | undefined) => {
  if (!discussionId) return;
  const discussion = await SQuery.newInstance('discussion', { id: discussionId });
  if (!discussion) return;
  const ArrayDiscussion = await discussion?.channel;
  if (!ArrayDiscussion) return;

  ArrayDiscussion?.when(
    'update',
    async (obj) => {
      let messageId = obj?.added[0];

      if (!messageId) return;

      let messageInstance = await SQuery.newInstance('message', { id: messageId });

      if (!messageInstance) return;

      let newMessage = messageInstance.$cache;

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
          ID_MESSAGE_SERVEUR: newMessage._id,
          ID_Conversation: discussionId || '',
          ID_Expediteur: newMessage.account,
        },
        { Date_Reçu: Date.now(), ID_MESSAGE_SERVEUR: messageId },
        files
      );
      eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
    },
    'receiveMessage:' + discussionId
  );

  return ArrayDiscussion;
};

export const sendServer = async (
  discussionId: string,
  accountId: string,
  files: FileType[] | undefined,
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

    addStatutMessage({ ID_MESSAGE_SERVEUR: messageAdd?.added[0], Date_Envoye: messageInstance?.__createdAt });

    eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
  }
};
export const putMessageLocal = async (
  files: FileType[] | undefined,
  value: string | undefined,
  discussionId: string,
  accountId: string
) => {
  try {
    let fileMap =
      files?.map((file) => {
        return {
          extension: file.type.split('/')[1],
          size: file.size,
          url: file.uri || '',
          buffer: file.buffer,
          type: file.type,
          fileName: file.fileName,
          encoding: file.encoding,
        };
      }) || [];

    await createMessageWithStatusAndFiles(
      {
        Contenu_Message: value || null,
        Horodatage: Date.now(),
        ID_MESSAGE_SERVEUR: null,
        ID_Conversation: discussionId,
        ID_Expediteur: accountId,
      },
      {},
      fileMap
    );
    eventEmitter.emit(EventMessageType.receiveMessage + discussionId);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
