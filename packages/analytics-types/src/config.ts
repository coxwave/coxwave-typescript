import { Event } from './events';
import { LogLevel, Logger } from './logger';
import { SessionManager, UserSession } from './session-manager';
import { Storage } from './storage';
import { Transport, TTransportType } from './transport';

export const ServerZone = ['US', 'EU'] as const;
export type TServerZone = (typeof ServerZone)[number];

export interface Config {
  projectToken: string;
  flushIntervalMillis: number;
  flushMaxRetries: number;
  flushQueueSize: number;
  logLevel: LogLevel;
  loggerProvider: Logger;
  optOut: boolean;
  library?: string;
  serverUrl: string | undefined;
  serverZone?: TServerZone;
  storageProvider?: Storage<Event[]>;
  transportProvider: Transport;
  useBatch: boolean;
}

export interface BrowserConfig extends Config {
  distinctId?: string;
  userId?: string;
  deviceId?: string;
  threadId?: string;
  sessionId?: number;
  cookieExpiration: number;
  cookieSameSite: string;
  cookieSecure: boolean;
  cookieStorage: Storage<UserSession>;
  disableCookies: boolean;
  domain: string;
  lastEventTime?: number;
  sessionManager: SessionManager;
  sessionTimeout: number;
  trackingOptions: TrackingOptions;
  appVersion?: string;
}

export type ReactNativeConfig = Omit<BrowserConfig, 'trackingOptions'> & {
  trackingOptions: ReactNativeTrackingOptions;
  trackingSessionEvents?: boolean;
};

export type NodeConfig = Config;

export type InitOptions<T extends Config> =
  | Partial<Config> &
      Omit<T, keyof Config> & {
        projectToken: string;
        transportProvider: Transport;
      };

export interface TrackingOptions {
  deviceManufacturer?: boolean;
  deviceModel?: boolean;
  ipAddress?: boolean;
  language?: boolean;
  osName?: boolean;
  osVersion?: boolean;
  platform?: boolean;
  [key: string]: boolean | undefined;
}

export interface ReactNativeTrackingOptions extends TrackingOptions {
  adid?: boolean;
  carrier?: boolean;
}

export type BrowserOptions = Omit<
  Partial<
    BrowserConfig & {
      transport: TTransportType;
    }
  >,
  'projectToken'
>;

export type ReactNativeOptions = Omit<
  Partial<
    ReactNativeConfig & {
      transport: TTransportType;
    }
  >,
  'projectToken'
>;

export type NodeOptions = Omit<Partial<NodeConfig>, 'projectToken'>;
