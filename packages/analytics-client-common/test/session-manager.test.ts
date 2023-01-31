import { MemoryStorage } from '@coxwave/analytics-core';
import { UserSession } from '@coxwave/analytics-types';

import { PROJECT_TOKEN } from './helpers/constants';

import { SessionManager } from '../src/session-manager';

describe('session-manager', () => {
  describe('load', () => {
    test('should use persisted session value', async () => {
      const storage = new MemoryStorage<UserSession>();
      const get = jest.spyOn(storage, 'get').mockReturnValueOnce(
        Promise.resolve({
          optOut: true,
        }),
      );
      const sessionManager = await new SessionManager(storage, PROJECT_TOKEN).load();
      expect(sessionManager.cache).toEqual({
        optOut: true,
      });
      expect(get).toHaveBeenCalledTimes(1);
    });

    test('should use default session value', async () => {
      const storage = new MemoryStorage<UserSession>();
      const get = jest.spyOn(storage, 'get').mockReturnValueOnce(Promise.resolve(undefined));
      const sessionManager = await new SessionManager(storage, PROJECT_TOKEN).load();
      expect(sessionManager.cache).toEqual({
        optOut: false,
      });
      expect(get).toHaveBeenCalledTimes(1);
    });
  });

  describe('setSession', () => {
    test('should set session', async () => {
      const storage = new MemoryStorage<UserSession>();
      const set = jest.spyOn(storage, 'set');
      const sessionManager = await new SessionManager(storage, PROJECT_TOKEN).load();
      sessionManager.setSession({ sessionId: 1 });
      expect(set).toHaveBeenCalledTimes(1);
      expect(sessionManager.cache.sessionId).toBe(1);
    });
  });

  describe('setSessionId/getSessionId', () => {
    test('should set/get session id', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      expect(sessionManager.getSessionId()).toBe(undefined);
      sessionManager.setSessionId(1);
      expect(sessionManager.getSessionId()).toBe(1);
    });
  });

  describe('setThreadId/getThreadId', () => {
    test('should set/get thread id', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      sessionManager.setThreadId('threadId');
      expect(sessionManager.getThreadId()).toBe('threadId');
    });
  });

  describe('setUserId/getUserId', () => {
    test('should set/get user id', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      sessionManager.setUserId('userId');
      expect(sessionManager.getUserId()).toBe('userId');
    });
  });

  describe('setDeviceId/getDeviceId', () => {
    test('should set/get device id', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      sessionManager.setDeviceId('deviceId');
      expect(sessionManager.getDeviceId()).toBe('deviceId');
    });
  });

  describe('setDistinctId/getDistinctId', () => {
    test('should set/get distinct id', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      sessionManager.setDistinctId('distinctId');
      expect(sessionManager.getDistinctId()).toBe('distinctId');
    });
  });

  describe('setLastEventTime/getLastEventTime', () => {
    test('should set/get last event time', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      const time = Date.now();
      sessionManager.setLastEventTime(time);
      expect(sessionManager.getLastEventTime()).toBe(time);
    });
  });

  describe('setOptOut/getOptOut', () => {
    test('should set/get OptOut', async () => {
      const sessionManager = await new SessionManager(new MemoryStorage(), PROJECT_TOKEN).load();
      sessionManager.setOptOut(true);
      expect(sessionManager.getOptOut()).toBe(true);
    });
  });
});
