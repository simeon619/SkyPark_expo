import { IconName } from '../managementState/client/preference';

export const HEIGHT_BOTTOM = 55;

export const MEDIUM_PIC_USER = 70;
export const LARGE_PIC_USER = 80;
export const SMALL_PIC_USER = 35;

export const HOST = 'http://192.168.1.2:3500';
export const LIMIT_TRANSACTION = 20;

export const formTextPlaceholder = (str: IconName) => {
  if (str === 'Vote' || str === 'Annonce') {
    return `Pose ta question, Asemai !!`;
  } else {
    return `Quoi de neuf, Asemai?`;
  }
};
