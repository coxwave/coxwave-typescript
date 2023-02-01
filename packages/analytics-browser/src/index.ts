/* eslint-disable @typescript-eslint/unbound-method */
import client from './browser-client';

export { createInstance } from './browser-client';
export const {
  add,
  flush,
  getDistinctId,
  getUserId,
  getDeviceId,
  getSessionId,
  getThreadId,
  register,
  identify,
  alias,
  init,
  remove,
  reset,
  setDistinctId,
  setUserId,
  setDeviceId,
  setOptOut,
  setSessionId,
  setThreadId,
  setTransport,
  resetThreadId,
  track,
  log,
  feedback,
} = client;
export { runQueuedFunctions } from './utils/snippet-helper';
export { Identify } from '@coxwave/analytics-core';
export * as Types from '@coxwave/analytics-types';
