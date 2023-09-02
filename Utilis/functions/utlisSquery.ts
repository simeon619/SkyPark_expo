import { ArrayData, InstanceInterface } from '../../lib/SQueryClient';
import { SQuery } from '../../managementState';

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
  return ArrayDiscussion;
};

// if (withChannel && discussionId) {
//   const discussion = await SQuery.newInstance('discussion', { id: discussionId });
//   if (!discussion) return '' as GetDiscussionReturnType<T>;
//   const ArrayDiscussion = await discussion.channel;

//   return {
//     discussionId,
//     channel: ArrayDiscussion,
//   } as GetDiscussionReturnType<T>;
// }
