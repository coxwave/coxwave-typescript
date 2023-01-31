import { COXWAVE_PREFIX, STORAGE_PREFIX } from '../constants';

export const getCookieName = (projectToken: string, prefix = COXWAVE_PREFIX, postKey = '', limit = 25) => {
  return getStorageName(projectToken, prefix, postKey, limit);
};

export const getStorageName = (projectToken: string, prefix = STORAGE_PREFIX, postKey = '', limit = 25) => {
  return [prefix, postKey, projectToken.substring(0, limit)].filter(Boolean).join('_');
};
