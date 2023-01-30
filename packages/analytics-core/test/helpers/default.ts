import { Config } from '@coxwave/analytics-types';

import { getDefaultConfig } from '../../src/config';

export const useDefaultConfig = (): Config => ({
  projectToken: PROJECT_TOKEN,
  transportProvider: {
    send: () => Promise.resolve(null),
  },
  storageProvider: {
    isEnabled: async () => true,
    get: async () => undefined,
    set: async () => undefined,
    remove: async () => undefined,
    reset: async () => undefined,
    getRaw: async () => undefined,
  },
  ...getDefaultConfig(),
});

export const PROJECT_TOKEN = 'projectToken';
export const DISTINCT_ID = 'distinctId';
export const DEVICE_ID = 'deviceId';
export const ALIAS_NAME = 'testAliasName';

/*
There is no way to figure out the state of a promise with normal API.
This helper expose the state of a promise via race.
https://stackoverflow.com/a/35820220

Example:
const a = Promise.resolve();
const b = Promise.reject();
const c = new Promise(() => {});

promiseState(a).then(state => console.log(state)); // fulfilled
promiseState(b).then(state => console.log(state)); // rejected
promiseState(c).then(state => console.log(state)); // pending
*/
export function promiseState(p: Promise<any>) {
  const t = {};
  return Promise.race([p, t]).then(
    (v) => (v === t ? 'pending' : 'fulfilled'),
    () => 'rejected',
  );
}

export function matchUUID(uuid: string) {
  return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
}
