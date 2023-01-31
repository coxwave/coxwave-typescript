import { COXWAVE_PREFIX, getStorageName } from '@coxwave/analytics-core';
import { UserSession, Storage, SessionManager as ISessionManager } from '@coxwave/analytics-types';

export class SessionManager implements ISessionManager {
  storageKey: string;
  cache: UserSession;

  constructor(private storage: Storage<UserSession>, projectToken: string) {
    this.storageKey = getStorageName(projectToken, COXWAVE_PREFIX);
    this.cache = { optOut: false };
  }

  /**
   * load() must be called immediately after instantation
   *
   * ```ts
   * await new SessionManager(...).load();
   * ```
   */
  async load() {
    this.cache = (await this.storage.get(this.storageKey)) ?? {
      optOut: false,
    };
    return this;
  }

  setSession(session: Partial<UserSession>) {
    this.cache = { ...this.cache, ...session };
    void this.storage.set(this.storageKey, this.cache);
  }

  getSessionId() {
    return this.cache.sessionId;
  }

  setSessionId(sessionId: number) {
    this.setSession({ sessionId });
  }

  getThreadId() {
    return this.cache.threadId;
  }

  setThreadId(threadId: string) {
    this.setSession({ threadId });
  }

  getUserId(): string | undefined {
    return this.cache.userId;
  }

  setUserId(userId: string): void {
    this.setSession({ userId });
  }

  getDeviceId(): string | undefined {
    return this.cache.deviceId;
  }

  setDeviceId(deviceId: string): void {
    this.setSession({ deviceId });
  }

  getDistinctId(): string | undefined {
    return this.cache.distinctId;
  }

  setDistinctId(distinctId: string): void {
    this.setSession({ distinctId });
  }

  getLastEventTime() {
    return this.cache.lastEventTime;
  }

  setLastEventTime(lastEventTime: number) {
    this.setSession({ lastEventTime });
  }

  getOptOut(): boolean {
    return this.cache.optOut;
  }

  setOptOut(optOut: boolean): void {
    this.setSession({ optOut });
  }
}
