import { COXWAVE_PREFIX, STORAGE_PREFIX } from '../constants';

export const getCookieName = (projectToken: string, postKey = '', limit = 25) => {
  return [COXWAVE_PREFIX, postKey, projectToken.substring(0, limit)].filter(Boolean).join('_');
};

export const getStorageName = (projectToken: string, postKey = '', limit = 25) => {
  return [STORAGE_PREFIX, postKey, projectToken.substring(0, limit)].filter(Boolean).join('_');
};
