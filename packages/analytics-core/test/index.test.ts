import {
  CoxwaveCore,
  ActivityDestination,
  GenerationDestination,
  FeedbackDestination,
  IdentifyDestination,
  BaseTransport,
  Config,
  Logger,
  COXWAVE_PREFIX,
  returnWrapper,
  debugWrapper,
  getClientLogConfig,
  getClientStates,
  UUID,
  MemoryStorage,
  getCookieName,
  getStorageName,
  createIdentifyUserEvent,
} from '../src/index';

describe('index', () => {
  test('should expose apis', () => {
    const client = new CoxwaveCore();
    expect(typeof client._init).toBe('function');
    expect(typeof client.track).toBe('function');
    expect(typeof client.log).toBe('function');
    expect(typeof client.feedback).toBe('function');
    expect(typeof client.identify).toBe('function');
    expect(typeof client.setOptOut).toBe('function');
    expect(typeof client.add).toBe('function');
    expect(typeof client.remove).toBe('function');
    expect(typeof BaseTransport).toBe('function');
    expect(typeof ActivityDestination).toBe('function');
    expect(typeof GenerationDestination).toBe('function');
    expect(typeof FeedbackDestination).toBe('function');
    expect(typeof IdentifyDestination).toBe('function');
    expect(typeof Config).toBe('function');
    expect(typeof Logger).toBe('function');
    expect(typeof returnWrapper).toBe('function');
    expect(typeof debugWrapper).toBe('function');
    expect(typeof getClientLogConfig).toBe('function');
    expect(typeof getClientStates).toBe('function');
    expect(typeof UUID).toBe('function');
    expect(typeof MemoryStorage).toBe('function');
    expect(typeof getCookieName).toBe('function');
    expect(typeof getStorageName).toBe('function');
    expect(typeof createIdentifyUserEvent).toBe('function');
    expect(COXWAVE_PREFIX).toBe('COX');
  });
});
