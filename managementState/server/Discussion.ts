import { generateTimestampUUID } from '../../Utilis/functions/generateUUID';
import { getDiscussionId, putMessageLocal, sendServer } from '../../Utilis/functions/utlisSquery';
import { FileType } from '../../lib/SQueryClient';

export const sendMessage = async (data: { value?: string; accountId: string | undefined; files: FileType[] }) => {
  const { accountId, files, value } = data;

  if (!accountId) {
    console.error('Error sending message1:', data);
    return;
  }
  let discussionId = await getDiscussionId(accountId);
  if (!discussionId) return;
  let uuuid = generateTimestampUUID();

  try {
    await putMessageLocal(files, value, discussionId, accountId, uuuid);

    await sendServer(discussionId, accountId, uuuid, files, value);
  } catch (error) {
    console.error('Error sending message2:', error);
  }
};
