import { getLanguage } from '@coxwave/analytics-client-common';
import {
  PredefinedProperties,
  BeforePlugin,
  BrowserConfig,
  Event,
  PluginType,
  PluginCoverage,
  TPluginCoverage,
} from '@coxwave/analytics-types';
import UAParser from '@coxwave/ua-parser-js';

import { VERSION } from '../version';

const BROWSER_PLATFORM = 'Web';
const IP_ADDRESS = '$remote';

export class Context implements BeforePlugin {
  name = 'context';
  type = PluginType.BEFORE;
  coverage: TPluginCoverage = PluginCoverage.ALL;

  // this.config is defined in setup() which will always be called first
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config: BrowserConfig;
  uaResult: UAParser.IResult;
  library = `coxwave-ts/${VERSION}`;

  constructor() {
    let agent: string | undefined;
    /* istanbul ignore else */
    if (typeof navigator !== 'undefined') {
      agent = navigator.userAgent;
    }
    this.uaResult = new UAParser(agent).getResult();
  }

  setup(config: BrowserConfig): Promise<undefined> {
    this.config = config;

    return Promise.resolve(undefined);
  }

  async execute(event: Event): Promise<Event> {
    /**
     * Manages user session triggered by new events
     */
    if (!this.isSessionValid()) {
      // Creates new session
      this.config.sessionId = Date.now();
    } // else use previously creates session
    // Updates last event time to extend time-based session
    this.config.lastEventTime = Date.now();
    const time = new Date().getTime();
    const osName = this.uaResult.browser.name;
    const osVersion = this.uaResult.browser.version;
    const deviceModel = this.uaResult.device.model || this.uaResult.os.name;
    const deviceVendor = this.uaResult.device.vendor;

    const properties: PredefinedProperties = {
      $distinctId: this.config.distinctId,
      $userId: this.config.userId,
      $deviceId: this.config.deviceId,
      $sessionId: this.config.sessionId,
      $threadId: this.config.threadId,
      $time: time,
      ...(this.config.appVersion && { $appVersion: this.config.appVersion }),
      ...(this.config.trackingOptions.platform && { $platform: BROWSER_PLATFORM }),
      ...(this.config.trackingOptions.osName && { $osName: osName }),
      ...(this.config.trackingOptions.osVersion && { $osVersion: osVersion }),
      ...(this.config.trackingOptions.deviceManufacturer && { $deviceManufacturer: deviceVendor }),
      ...(this.config.trackingOptions.deviceModel && { $deviceModel: deviceModel }),
      ...(this.config.trackingOptions.language && { $language: getLanguage() }),
      ...(this.config.trackingOptions.ipAddress && { $ip: IP_ADDRESS }),
      $library: this.library,
    };
    event.properties = { ...properties, ...event.properties };

    return event;
  }

  isSessionValid() {
    const lastEventTime = this.config.lastEventTime || Date.now();
    const timeSinceLastEvent = Date.now() - lastEventTime;
    return timeSinceLastEvent < this.config.sessionTimeout;
  }
}
