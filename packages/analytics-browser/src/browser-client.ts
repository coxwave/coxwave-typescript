import {
  CoxwaveCore,
  ActivityDestination,
  Identify,
  UUID,
  returnWrapper,
  debugWrapper,
  getClientLogConfig,
  getClientStates,
  GenerationDestination,
  FeedbackDestination,
  IdentifyDestination,
} from '@coxwave/analytics-core';
import {
  BrowserClient,
  BrowserConfig,
  BrowserOptions,
  Identify as IIdentify,
  Result,
  TTransportType,
} from '@coxwave/analytics-types';

import { useBrowserConfig, createTransport } from './config';
import { Context } from './plugins/context';
import { convertProxyObjectToRealObject, isInstanceProxy } from './utils/snippet-helper';

export class CoxwaveBrowser extends CoxwaveCore<BrowserConfig> {
  async init(projectToken = '', options?: BrowserOptions) {
    // Step 0: Block concurrent initialization
    if (this.initializing) {
      return;
    }
    this.initializing = true;

    // Step 1: Create browser config
    const browserOptions = await useBrowserConfig(projectToken, {
      ...options,
      userId: options?.userId,
      deviceId: options?.deviceId,
      sessionId: options?.sessionId,
      optOut: options?.optOut,
    });

    // Step 2: BrowserConfig setups
    await super._init(browserOptions);
    if (!this.config.distinctId) {
      throw new Error('DistinctId is not set');
    }

    // Step 3: Manage session
    if (
      !this.config.sessionId ||
      (this.config.lastEventTime && Date.now() - this.config.lastEventTime > this.config.sessionTimeout)
    ) {
      // Either
      // 1) No previous session; or
      // 2) Previous session expired
      this.setSessionId(Date.now());
    }

    // Step 4: Install plugins
    await this.add(new Context());
    await this.add(new ActivityDestination());
    await this.add(new GenerationDestination());
    await this.add(new FeedbackDestination());
    await this.add(new IdentifyDestination());

    this.initializing = false;

    // Step 5: Notify my DistinctId to server
    void this.register();

    // Step 6: Run queued dispatch functions
    await this.runQueuedFunctions('dispatchQ');
  }

  getDistinctId() {
    return this.config?.distinctId;
  }

  setDistinctId(distinctId: string) {
    if (!this.config) {
      this.q.push(this.setDistinctId.bind(this, distinctId));
      return;
    }
    this.config.distinctId = distinctId;
  }

  getUserId() {
    return this.config?.userId;
  }

  setUserId(userId?: string) {
    if (!this.config) {
      this.q.push(this.setUserId.bind(this, userId));
      return;
    }
    this.config.userId = userId;
  }

  getDeviceId() {
    return this.config?.deviceId;
  }

  setDeviceId(deviceId: string) {
    if (!this.config) {
      this.q.push(this.setDeviceId.bind(this, deviceId));
      return;
    }
    this.config.deviceId = deviceId;
  }

  reset() {
    this.setDistinctId(UUID());
    this.setUserId(undefined);
    this.setDeviceId(UUID());
  }

  getSessionId() {
    return this.config?.sessionId;
  }

  setSessionId(sessionId: number) {
    if (!this.config) {
      this.q.push(this.setSessionId.bind(this, sessionId));
      return;
    }
    this.config.sessionId = sessionId;
    this.config.lastEventTime = undefined;
  }

  getThreadId() {
    return this.config?.threadId;
  }

  setThreadId(threadId?: string) {
    if (!this.config) {
      this.q.push(this.setThreadId.bind(this, threadId));
      return;
    }
    this.config.threadId = threadId;
    this.config.lastEventTime = undefined;
  }

  resetThreadId() {
    this.setThreadId(undefined);
  }

  setTransport(transport: TTransportType) {
    if (!this.config) {
      this.q.push(this.setTransport.bind(this, transport));
      return;
    }
    this.config.transportProvider = createTransport(transport);
  }

  register() {
    if (!this.config) {
      this.q.push(this.register.bind(this));
    }
    const distinctId = this.getDistinctId() as string;
    return super.register(distinctId);
  }

  identify(alias?: string, identify?: IIdentify): Promise<Result> {
    if (isInstanceProxy(identify)) {
      const queue = identify._q;
      identify._q = [];
      identify = convertProxyObjectToRealObject(new Identify(), queue);
    }

    alias = alias || this.getUserId();
    if (alias === undefined) {
      throw new Error("alias is not set. Please set alias in identify() or in the constructor's options.");
    } else {
      this.setUserId(alias);
    }

    const updateDistinctIdCallback = (result: Result) => {
      const newId = result?.body?.distinctId as string;
      if (newId) this.setDistinctId(newId);
      return result;
    };

    return super.identify(alias, identify).then((result: Result) => {
      return updateDistinctIdCallback(result);
    });
  }

  alias(alias: string) {
    if (!this.config) {
      this.q.push(this.alias.bind(this, alias));
    }

    const distinctId = this.getDistinctId() as string;
    return super.alias(alias, distinctId);
  }
}

export const createInstance = (): BrowserClient => {
  const client = new CoxwaveBrowser();
  return {
    init: debugWrapper(
      returnWrapper(client.init.bind(client)),
      'init',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    add: debugWrapper(
      returnWrapper(client.add.bind(client)),
      'add',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.plugins']),
    ),
    remove: debugWrapper(
      returnWrapper(client.remove.bind(client)),
      'remove',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.plugins']),
    ),
    track: debugWrapper(
      client.track.bind(client),
      'track',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    log: debugWrapper(
      client.log.bind(client),
      'log',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    feedback: debugWrapper(
      client.feedback.bind(client),
      'feedback',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    register: debugWrapper(
      returnWrapper(client.register.bind(client)),
      'register',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    identify: debugWrapper(
      returnWrapper(client.identify.bind(client)),
      'identify',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    alias: debugWrapper(
      returnWrapper(client.alias.bind(client)),
      'alias',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    flush: debugWrapper(
      returnWrapper(client.flush.bind(client)),
      'flush',
      getClientLogConfig(client),
      getClientStates(client, ['config.projectToken', 'timeline.queue.length']),
    ),
    getDistinctId: debugWrapper(
      client.getDistinctId.bind(client),
      'getDistinctId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.distinctId']),
    ),
    setDistinctId: debugWrapper(
      client.setDistinctId.bind(client),
      'setDistinctId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.distinctId']),
    ),
    getUserId: debugWrapper(
      client.getUserId.bind(client),
      'getUserId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.deviceId']),
    ),
    setUserId: debugWrapper(
      client.setUserId.bind(client),
      'setUserId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.deviceId']),
    ),
    getDeviceId: debugWrapper(
      client.getDeviceId.bind(client),
      'getDeviceId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.deviceId']),
    ),
    setDeviceId: debugWrapper(
      client.setDeviceId.bind(client),
      'setDeviceId',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.deviceId']),
    ),
    reset: debugWrapper(
      client.reset.bind(client),
      'reset',
      getClientLogConfig(client),
      getClientStates(client, ['config', 'config.distinctId', 'config.deviceId']),
    ),
    getSessionId: debugWrapper(
      client.getSessionId.bind(client),
      'getSessionId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setSessionId: debugWrapper(
      client.setSessionId.bind(client),
      'setSessionId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    getThreadId: debugWrapper(
      client.getThreadId.bind(client),
      'getThreadId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setThreadId: debugWrapper(
      client.setThreadId.bind(client),
      'setThreadId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    resetThreadId: debugWrapper(
      client.resetThreadId.bind(client),
      'resetThreadId',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setOptOut: debugWrapper(
      client.setOptOut.bind(client),
      'setOptOut',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
    setTransport: debugWrapper(
      client.setTransport.bind(client),
      'setTransport',
      getClientLogConfig(client),
      getClientStates(client, ['config']),
    ),
  };
};

export default createInstance();
