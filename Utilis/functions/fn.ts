import { ArrayData, InstanceInterface } from '../../lib/SQueryClient';

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
