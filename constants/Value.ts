import { IconName } from '../managementState/client/preference';
import { useAuthStore } from '../managementState/server/auth';

export const HEIGHT_BOTTOM = 55;

export const MEDIUM_PIC_USER = 70;
export const LARGE_PIC_USER = 80;
export const SMALL_PIC_USER = 35;

export const HOST = 'http://192.168.1.11:3500';
export const DB_NAME = 'simeon.db';
export const LIMIT_TRANSACTION = 20;

export const formTextPlaceholder = (str: IconName) => {
  const account = useAuthStore((state) => state.account);

  if (str === 'Vote' || str === 'Annonce') {
    return `Pose ta question, ${account?.name} !!`;
  } else {
    return `Quoi de neuf, ${account?.name}?`;
  }
};
