import { FetchTransport } from '@coxwave/analytics-client-common';
import * as core from '@coxwave/analytics-core';
import { Status, TransportType, UserSession } from '@coxwave/analytics-types';

import { PROJECT_TOKEN, USER_ID, DEVICE_ID, DISTINCT_ID, THREAD_ID } from './helpers/default';

import { CoxwaveBrowser } from '../src/browser-client';
import * as Config from '../src/config';
import * as SnippetHelper from '../src/utils/snippet-helper';

describe('browser-client', () => {
  afterEach(() => {
    // clean up cookies
    document.cookie = 'COX_PROJECT_TOKEN=null; expires=-1';
  });

  describe('init', () => {
    test('should initialize client', async () => {
      const client = new CoxwaveBrowser();
      const register = jest.fn();
      client.register = register;
      await client.init(PROJECT_TOKEN, {});
      expect(register).toHaveBeenCalledTimes(1);
    });

    test('should initialize without error when projectToken is undefined', async () => {
      const client = new CoxwaveBrowser();
      const register = jest.fn();
      client.register = register;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await client.init(undefined as any, {});
      expect(register).toHaveBeenCalledTimes(1);
    });

    test('should read from cookies config', async () => {
      const cookieStorage = new core.MemoryStorage<UserSession>();
      jest.spyOn(cookieStorage, 'get').mockResolvedValue({
        sessionId: 1,
        deviceId: DEVICE_ID,
        distinctId: DISTINCT_ID,
        threadId: 'threadId',
        optOut: false,
      });
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        optOut: true,
        cookieStorage,
      });
      expect(client.getDeviceId()).toBe(DEVICE_ID);
      expect(client.getDistinctId()).toBe(DISTINCT_ID);
      expect(client.getThreadId()).toBe('threadId');
      expect(client.getSessionId()).toBe(1);
    });

    test('should call prevent concurrent init executions', async () => {
      const useBrowserConfig = jest.spyOn(Config, 'useBrowserConfig');
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await Promise.all([
        client.init(PROJECT_TOKEN, {}),
        client.init(PROJECT_TOKEN, {}),
        client.init(PROJECT_TOKEN, {}),
      ]);
      // NOTE: `parseOldCookies` and `useBrowserConfig` are only called once despite multiple init calls
      expect(useBrowserConfig).toHaveBeenCalledTimes(1);
    });

    test('should update sessionId if expired', async () => {
      const client = new CoxwaveBrowser();
      const register = jest.fn();
      client.register = register;
      const now = Date.now();
      await client.init(PROJECT_TOKEN, {
        sessionId: 1,
        lastEventTime: now,
        sessionTimeout: 0,
      });
      expect(client.getSessionId()).not.toBe(1);
    });
  });

  describe('getUserId', () => {
    test('should get user id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        userId: USER_ID,
      });
      expect(client.getUserId()).toBe(USER_ID);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getUserId()).toBe(undefined);
    });
  });

  describe('setUserId', () => {
    test('should set user id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {});
      expect(client.getUserId()).toBe(undefined);
      client.setUserId(USER_ID);
      expect(client.getUserId()).toBe(USER_ID);
    });

    test('should defer set user id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client.init(PROJECT_TOKEN, {}).then(() => {
          expect(client.getUserId()).toBe('user@coxwave.com');
          resolve();
        });
        client.setUserId('user@coxwave.com');
      });
    });
  });

  describe('getDistinctId', () => {
    test('should get distinct id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        distinctId: DISTINCT_ID,
      });
      expect(client.getDistinctId()).toBe(DISTINCT_ID);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getDistinctId()).toBe(undefined);
    });
  });

  describe('setDistinctId', () => {
    test('should set distinct id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {});
      expect(client.getDistinctId()).toBeDefined();
      client.setDistinctId(DISTINCT_ID);
      expect(client.getDistinctId()).toBe(DISTINCT_ID);
    });

    test('should defer set distinct id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client.init(PROJECT_TOKEN, {}).then(() => {
          expect(client.getDistinctId()).toBe('uuid');
          resolve();
        });
        client.setDistinctId('uuid');
      });
    });
  });

  describe('getDeviceId', () => {
    test('should get device id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        deviceId: DEVICE_ID,
      });
      expect(client.getDeviceId()).toBe(DEVICE_ID);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getDeviceId()).toBe(undefined);
    });
  });

  describe('setDeviceId', () => {
    test('should set device id config', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {});
      client.setDeviceId(DEVICE_ID);
      expect(client.getDeviceId()).toBe(DEVICE_ID);
    });

    test('should defer set device id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client.init(PROJECT_TOKEN, {}).then(() => {
          expect(client.getDeviceId()).toBe('asdfg');
          resolve();
        });
        client.setDeviceId('asdfg');
      });
    });
  });

  describe('getThreadId', () => {
    test('should get thread id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        threadId: THREAD_ID,
      });
      expect(client.getThreadId()).toBe(THREAD_ID);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getThreadId()).toBe(undefined);
    });
  });

  describe('setThreadId', () => {
    test('should set thread id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {});
      expect(client.getThreadId()).toBeDefined();
      client.setThreadId(THREAD_ID);
      expect(client.getThreadId()).toBe(THREAD_ID);
    });

    test('should defer set thread id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client.init(PROJECT_TOKEN, {}).then(() => {
          expect(client.getThreadId()).toBe('uuid');
          resolve();
        });
        client.setThreadId('uuid');
      });
    });
  });

  describe('reset', () => {
    test('should reset user id and generate new device id config', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN);
      client.setUserId(USER_ID);
      client.setDeviceId(DEVICE_ID);
      client.setDistinctId(DISTINCT_ID);
      client.setThreadId(THREAD_ID);
      expect(client.getUserId()).toBe(USER_ID);
      expect(client.getDeviceId()).toBe(DEVICE_ID);
      expect(client.getDistinctId()).toBe(DISTINCT_ID);
      expect(client.getThreadId()).toBe(THREAD_ID);
      client.reset();
      expect(client.getUserId()).toBe(undefined);
      expect(client.getDeviceId()).not.toBe(DEVICE_ID);
      expect(client.getDistinctId()).not.toBe(DISTINCT_ID);
      expect(client.getThreadId()).not.toBe(THREAD_ID);
    });
  });

  describe('getSessionId', () => {
    test('should get session id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        sessionId: 1,
      });
      expect(client.getSessionId()).toBe(1);
    });

    test('should handle undefined config', async () => {
      const client = new CoxwaveBrowser();
      expect(client.getSessionId()).toBe(undefined);
    });
  });

  describe('setSessionId', () => {
    test('should set session id', async () => {
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {});
      client.setSessionId(1);
      expect(client.getSessionId()).toBe(1);
    });

    test('should defer set session id', () => {
      return new Promise<void>((resolve) => {
        const client = new CoxwaveBrowser();
        void client.init(PROJECT_TOKEN, {}).then(() => {
          expect(client.getSessionId()).toBe(1);
          resolve();
        });
        client.setSessionId(1);
      });
    });
  });

  describe('setTransport', () => {
    test('should set transport', async () => {
      const fetch = new FetchTransport();
      const createTransport = jest.spyOn(Config, 'createTransport').mockReturnValueOnce(fetch);
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {});
      client.setTransport(TransportType.Fetch);
      expect(createTransport).toHaveBeenCalledTimes(2);
    });

    test('should defer set transport', () => {
      return new Promise<void>((resolve) => {
        const fetch = new FetchTransport();
        const createTransport = jest.spyOn(Config, 'createTransport').mockReturnValueOnce(fetch);
        const client = new CoxwaveBrowser();
        void client.init(PROJECT_TOKEN, {}).then(() => {
          expect(createTransport).toHaveBeenCalledTimes(2);
          resolve();
        });
        client.setTransport(TransportType.Fetch);
      });
    });
  });

  describe('identify', () => {
    test('should track identify', async () => {
      const send = jest.fn().mockReturnValueOnce({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
        },
      });
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        transportProvider: {
          send,
        },
      });
      const identifyObject = new core.Identify();
      identifyObject.set('$userId', '123');
      identifyObject.set('$deviceId', '123');
      const result = await client.identify('my-alias', identifyObject);
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
    });

    test('should update distinctId', async () => {
      const send = jest.fn().mockReturnValueOnce({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
          distinctId: 'newDistinctId',
        },
      });
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        transportProvider: {
          send,
        },
      });
      const identifyObject = new core.Identify();
      identifyObject.set('$userId', '123');
      identifyObject.set('$deviceId', '123');
      const result = await client.identify('my-alias', identifyObject);
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
      expect(client.getDistinctId()).toEqual('newDistinctId');
    });

    test('should not update distinctId if response doesnt have id', async () => {
      const send = jest.fn().mockReturnValueOnce({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
        },
      });
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        distinctId: DISTINCT_ID,
        transportProvider: {
          send,
        },
      });
      const identifyObject = new core.Identify();
      identifyObject.set('$userId', '123');
      identifyObject.set('$deviceId', '123');
      const result = await client.identify('my-alias', identifyObject);
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
      expect(client.getDistinctId()).toEqual(DISTINCT_ID);
    });

    test('should track identify using proxy', async () => {
      const send = jest.fn().mockReturnValueOnce({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
        },
      });
      const convertProxyObjectToRealObject = jest
        .spyOn(SnippetHelper, 'convertProxyObjectToRealObject')
        .mockReturnValueOnce(new core.Identify());
      const client = new CoxwaveBrowser();
      client.register = jest.fn();
      await client.init(PROJECT_TOKEN, {
        transportProvider: {
          send,
        },
      });
      const identifyObject = {
        _q: [],
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore to verify behavior in snippet installation
      const result = await client.identify('my-alias', identifyObject);
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
      expect(convertProxyObjectToRealObject).toHaveBeenCalledTimes(1);
    });
  });

  describe('alias', () => {
    test('should track alias', async () => {
      const send = jest.fn().mockReturnValue({
        status: Status.Success,
        statusCode: 200,
        body: {
          eventsIngested: 1,
          payloadSizeBytes: 1,
          serverUploadTime: 1,
        },
      });

      const client = new CoxwaveBrowser();
      client.register = jest.fn();

      await client.init(PROJECT_TOKEN, {
        transportProvider: {
          send,
        },
      });
      const result = await client.alias('my-alias');
      expect(result.code).toEqual(200);
      expect(send).toHaveBeenCalledTimes(1);
    });
  });
});
