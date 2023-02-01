import { LogLevel, ServerZone } from '@coxwave/analytics-types';

import { Config, createServerConfig, getServerUrl } from '../src/config';

import { PROJECT_TOKEN, useDefaultConfig } from './helpers/default';

import {
  COXWAVE_BATCH_SERVER_URL,
  COXWAVE_SERVER_URL,
  EU_COXWAVE_BATCH_SERVER_URL,
  EU_COXWAVE_SERVER_URL,
} from '../src/constants';

describe('config', () => {
  test('should create default config', () => {
    const defaultConfig = useDefaultConfig();
    const config = new Config({
      projectToken: PROJECT_TOKEN,
      storageProvider: defaultConfig.storageProvider,
      transportProvider: defaultConfig.transportProvider,
    });

    expect(config).toMatchObject({
      projectToken: PROJECT_TOKEN,
      flushIntervalMillis: 10000,
      flushMaxRetries: 12,
      flushQueueSize: 200,
      logLevel: LogLevel.Warn,
      loggerProvider: {}, // FIXME: need to be changed to new Logger(),
      _optOut: false,
      serverUrl: 'https://ingest-dev.coxwave.com',
      serverZone: 'US',
      storageProvider: defaultConfig.storageProvider,
      transportProvider: defaultConfig.transportProvider,
      useBatch: false,
    });
    expect(config.optOut).toBe(false);
  });

  test('should overwrite default config', () => {
    const defaultConfig = useDefaultConfig();
    const config = new Config({
      projectToken: PROJECT_TOKEN,
      logLevel: LogLevel.Verbose,
      optOut: true,
      storageProvider: defaultConfig.storageProvider,
      transportProvider: defaultConfig.transportProvider,
      useBatch: true,
    });
    expect(config).toMatchObject({
      projectToken: 'projectToken',
      flushIntervalMillis: 10000,
      flushMaxRetries: 12,
      flushQueueSize: 200,
      logLevel: LogLevel.Verbose,
      loggerProvider: {}, // FIXME: need to be changed to new Logger(),
      _optOut: true,
      serverUrl: 'https://ingest-dev.coxwave.com',
      serverZone: 'US',
      storageProvider: defaultConfig.storageProvider,
      transportProvider: defaultConfig.transportProvider,
      useBatch: true,
    });
  });

  describe('getServerUrl', () => {
    test('should return eu batch url', () => {
      expect(getServerUrl(ServerZone.EU, true)).toBe(EU_COXWAVE_BATCH_SERVER_URL);
    });
    test('should return eu http url', () => {
      expect(getServerUrl(ServerZone.EU, false)).toBe(EU_COXWAVE_SERVER_URL);
    });
    test('should return us batch url', () => {
      expect(getServerUrl(ServerZone.US, true)).toBe(COXWAVE_BATCH_SERVER_URL);
    });
    test('should return us http url', () => {
      expect(getServerUrl(ServerZone.US, false)).toBe(COXWAVE_SERVER_URL);
    });
  });

  describe('createServerConfig', () => {
    test('should return custom server url', () => {
      expect(createServerConfig('https://domain.com')).toEqual({
        serverZone: undefined,
        serverUrl: 'https://domain.com',
      });
    });

    test('should return default', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore to test invalid values
      expect(createServerConfig('', '', undefined)).toEqual({
        serverZone: ServerZone.US,
        serverUrl: COXWAVE_SERVER_URL,
      });
    });
  });
});
