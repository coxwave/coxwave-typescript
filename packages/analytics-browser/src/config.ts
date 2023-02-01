import { CookieStorage, getQueryParams, SessionManager, FetchTransport } from '@coxwave/analytics-client-common';
import { Config, MemoryStorage, UUID, getCookieName } from '@coxwave/analytics-core';
import {
  Event,
  BrowserOptions,
  BrowserConfig as IBrowserConfig,
  Storage,
  TrackingOptions,
  TransportType,
  UserSession,
  SessionManager as ISessionManager,
  TTransportType,
} from '@coxwave/analytics-types';

import { LocalStorage } from './storage/local-storage';
import { XHRTransport } from './transports/xhr';

export const getDefaultConfig = () => {
  const cookieStorage = new MemoryStorage<UserSession>();
  const trackingOptions: Required<TrackingOptions> = {
    deviceManufacturer: true,
    deviceModel: true,
    ipAddress: true,
    language: true,
    osName: true,
    osVersion: true,
    platform: true,
  };
  return {
    cookieExpiration: 365,
    cookieSameSite: 'Lax',
    cookieSecure: false,
    cookieStorage,
    disableCookies: false,
    domain: '',
    sessionManager: new SessionManager(cookieStorage, ''),
    sessionTimeout: 30 * 60 * 1000,
    storageProvider: new MemoryStorage<Event[]>(),
    trackingOptions,
    transportProvider: new FetchTransport(),
  };
};

export class BrowserConfig extends Config implements IBrowserConfig {
  appVersion?: string;
  cookieExpiration: number;
  cookieSameSite: string;
  cookieSecure: boolean;
  cookieStorage: Storage<UserSession>;
  disableCookies: boolean;
  domain: string;
  sessionTimeout: number;
  trackingOptions: TrackingOptions;
  sessionManager: ISessionManager;

  constructor(projectToken: string, options?: BrowserOptions) {
    const defaultConfig = getDefaultConfig();
    super({
      flushIntervalMillis: 1000,
      flushMaxRetries: 5,
      flushQueueSize: 30,
      ...options,
      projectToken,
      storageProvider: options?.storageProvider ?? defaultConfig.storageProvider,
      transportProvider: options?.transportProvider ?? defaultConfig.transportProvider,
    });
    this.cookieStorage = options?.cookieStorage ?? defaultConfig.cookieStorage;
    this.sessionManager = options?.sessionManager ?? defaultConfig.sessionManager;
    this.sessionTimeout = options?.sessionTimeout ?? defaultConfig.sessionTimeout;
    this.cookieExpiration = options?.cookieExpiration ?? defaultConfig.cookieExpiration;
    this.cookieSameSite = options?.cookieSameSite ?? defaultConfig.cookieSameSite;
    this.cookieSecure = options?.cookieSecure ?? defaultConfig.cookieSecure;
    this.disableCookies = options?.disableCookies ?? defaultConfig.disableCookies;
    this.domain = options?.domain ?? defaultConfig.domain;
    this.lastEventTime = this.lastEventTime ?? options?.lastEventTime;
    this.trackingOptions = options?.trackingOptions ?? defaultConfig.trackingOptions;
    this.appVersion = options?.appVersion;
    this.optOut = Boolean(options?.optOut);
    this.sessionId = options?.sessionId;
    this.threadId = options?.threadId;
    this.userId = options?.userId;
    this.deviceId = options?.deviceId;
    this.distinctId = options?.distinctId;
  }

  get userId() {
    return this.sessionManager.getUserId();
  }

  set userId(userId: string | undefined) {
    this.sessionManager.setUserId(userId);
  }

  get deviceId() {
    return this.sessionManager.getDeviceId();
  }

  set deviceId(deviceId: string | undefined) {
    this.sessionManager.setDeviceId(deviceId);
  }

  get distinctId() {
    return this.sessionManager.getDistinctId();
  }

  set distinctId(distinctId: string | undefined) {
    this.sessionManager.setDistinctId(distinctId);
  }

  get sessionId() {
    return this.sessionManager.getSessionId();
  }

  set sessionId(sessionId: number | undefined) {
    this.sessionManager.setSessionId(sessionId);
  }

  get threadId() {
    return this.sessionManager.getThreadId();
  }

  set threadId(threadId: string | undefined) {
    this.sessionManager.setThreadId(threadId);
  }

  get optOut() {
    return this.sessionManager.getOptOut();
  }

  set optOut(optOut: boolean) {
    this.sessionManager?.setOptOut(Boolean(optOut));
  }

  get lastEventTime() {
    return this.sessionManager.getLastEventTime();
  }

  set lastEventTime(lastEventTime: number | undefined) {
    this.sessionManager.setLastEventTime(lastEventTime);
  }
}

export const useBrowserConfig = async (projectToken: string, options?: BrowserOptions): Promise<IBrowserConfig> => {
  const defaultConfig = getDefaultConfig();
  const domain = options?.domain ?? (await getTopLevelDomain());
  const cookieStorage = await createCookieStorage({ ...options, domain });
  const cookieName = getCookieName(projectToken);
  const cookies = await cookieStorage.get(cookieName);
  const queryParams = getQueryParams();
  const sessionManager = await new SessionManager(cookieStorage, projectToken).load();

  return new BrowserConfig(projectToken, {
    ...options,
    cookieStorage,
    sessionManager,
    distinctId: createDistinctId(cookies?.distinctId),
    deviceId: createDeviceId(cookies?.deviceId, options?.deviceId, queryParams.deviceId),
    domain,
    optOut: options?.optOut ?? Boolean(cookies?.optOut),
    sessionId: cookies?.sessionId ?? options?.sessionId,
    threadId: cookies?.threadId ?? options?.threadId,
    storageProvider: await createEventsStorage(options),
    trackingOptions: { ...defaultConfig.trackingOptions, ...options?.trackingOptions },
    transportProvider: options?.transportProvider ?? createTransport(options?.transport),
  });
};

export const createCookieStorage = async (
  overrides?: BrowserOptions,
  baseConfig = getDefaultConfig(),
): Promise<Storage<UserSession>> => {
  const options = { ...baseConfig, ...overrides };
  const cookieStorage = overrides?.cookieStorage;
  if (!cookieStorage || !(await cookieStorage.isEnabled())) {
    return createFlexibleStorage<UserSession>(options);
  }
  return cookieStorage;
};

export const createFlexibleStorage = async <T>(options: BrowserOptions): Promise<Storage<T>> => {
  let storage: Storage<T> = new CookieStorage({
    domain: options.domain,
    expirationDays: options.cookieExpiration,
    sameSite: options.cookieSameSite,
    secure: options.cookieSecure,
  });
  if (options.disableCookies || !(await storage.isEnabled())) {
    storage = new LocalStorage();
    if (!(await storage.isEnabled())) {
      storage = new MemoryStorage();
    }
  }
  return storage;
};

export const createEventsStorage = async (overrides?: BrowserOptions): Promise<Storage<Event[]> | undefined> => {
  const hasStorageProviderProperty = overrides && Object.prototype.hasOwnProperty.call(overrides, 'storageProvider');
  // If storageProperty is explicitly undefined `{ storageProperty: undefined }`
  // then storageProvider is undefined
  // If storageProvider is implicitly undefined `{ }`
  // then storageProvider is LocalStorage
  // Otherwise storageProvider is overriden
  if (!hasStorageProviderProperty || overrides.storageProvider) {
    for (const storage of [overrides?.storageProvider, new LocalStorage<Event[]>()]) {
      if (storage && (await storage.isEnabled())) {
        return storage;
      }
    }
  }
  return undefined;
};

export const createDistinctId = (idFromCookies?: string) => {
  return idFromCookies || UUID();
};

export const createDeviceId = (idFromCookies?: string, idFromOptions?: string, idFromQueryParams?: string) => {
  return idFromOptions || idFromQueryParams || idFromCookies || UUID();
};

export const createTransport = (transport?: TTransportType) => {
  if (transport === TransportType.XHR) {
    return new XHRTransport();
  }
  return getDefaultConfig().transportProvider;
};

export const getTopLevelDomain = async (url?: string) => {
  if (!(await new CookieStorage<string>().isEnabled()) || (!url && typeof location === 'undefined')) {
    return '';
  }

  const host = url ?? location.hostname;
  const parts = host.split('.');
  const levels = [];
  const storageKey = 'COX_TLDTEST';

  for (let i = parts.length - 2; i >= 0; --i) {
    levels.push(parts.slice(i).join('.'));
  }
  for (let i = 0; i < levels.length; i++) {
    const domain = levels[i];
    const options = { domain: '.' + domain };
    const storage = new CookieStorage<number>(options);
    await storage.set(storageKey, 1);
    const value = await storage.get(storageKey);
    if (value) {
      await storage.remove(storageKey);
      return '.' + domain;
    }
  }

  return '';
};
