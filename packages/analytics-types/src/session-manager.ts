export interface UserSession {
  distinctId?: string;
  userId?: string;
  deviceId?: string;
  sessionId?: number;
  threadId?: string;
  lastEventTime?: number;
  optOut: boolean;
}

export interface SessionManagerOptions {
  projectToken: string;
  sessionTimeout: number;
}

export interface SessionManager {
  setSession(session: UserSession): void;
  getDistinctId(): string | undefined;
  setDistinctId(distinctId?: string): void;
  getUserId(): string | undefined;
  setUserId(userId?: string): void;
  getDeviceId(): string | undefined;
  setDeviceId(deviceId?: string): void;
  getSessionId(): number | undefined;
  setSessionId(sessionId?: number): void;
  getThreadId(): string | undefined;
  setThreadId(threadId?: string): void;
  getLastEventTime(): number | undefined;
  setLastEventTime(lastEventTime?: number): void;
  getOptOut(): boolean;
  setOptOut(optOut: boolean): void;
}
