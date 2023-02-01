import { AvailableEventType, Event } from '@coxwave/analytics-types';

import { Context } from '../../src/plugins/context';
import { DISTINCT_ID, useDefaultConfig } from '../helpers/default';

describe('context', () => {
  describe('setup', () => {
    test('should setup plugin', async () => {
      const context = new Context();
      const config = useDefaultConfig();
      config.appVersion = '1.0.0';
      await context.setup(config);
      expect(context.config.appVersion).toEqual('1.0.0');
      expect(context.uaResult).toBeDefined();
    });

    test('should setup plugin without app version', async () => {
      const context = new Context();
      const config = useDefaultConfig();
      await context.setup(config);
      expect(context.config.appVersion).toBeUndefined();
      expect(context.uaResult).toBeDefined();
    });
  });

  describe('execute', () => {
    test('should execute plugin', async () => {
      const context = new Context();
      jest.spyOn(context, 'isSessionValid').mockReturnValue(true);
      const config = useDefaultConfig('user@coxwave.com', {
        distinctId: DISTINCT_ID,
        deviceId: 'deviceId',
        sessionId: 1,
      });
      config.appVersion = '1.0.0';
      await context.setup(config);

      const event: Event = {
        id: 'uuid',
        eventType: AvailableEventType.TRACK,
        eventName: 'eventName',
      };
      const firstContextEvent = await context.execute(event);
      expect(firstContextEvent.eventName).toEqual('eventName');
      expect(firstContextEvent.properties?.$appVersion).toEqual('1.0.0');
      expect(firstContextEvent.properties?.$platform).toEqual('Web');
      expect(firstContextEvent.properties?.$osName).toBeDefined();
      expect(firstContextEvent.properties?.$osVersion).toBeDefined();
      expect(firstContextEvent.properties?.$language).toBeDefined();
      expect(firstContextEvent.properties?.$distinctId).toBeDefined();
      expect(firstContextEvent.properties?.$time).toBeDefined();
      expect(firstContextEvent.properties?.$ip).toEqual('$remote');
      expect(firstContextEvent.properties?.$deviceId).toEqual('deviceId');
      expect(firstContextEvent.properties?.$sessionId).toEqual(1);
      expect(firstContextEvent.properties?.$userId).toEqual('user@coxwave.com');
    });

    test('should not return the properties when the tracking options are false', async () => {
      const context = new Context();
      jest.spyOn(context, 'isSessionValid').mockReturnValue(true);
      const config = useDefaultConfig('user@coxwave.com', {
        distinctId: DISTINCT_ID,
        deviceId: 'deviceId',
        sessionId: 1,
        trackingOptions: {
          deviceManufacturer: false,
          deviceModel: false,
          ipAddress: false,
          language: false,
          osName: false,
          osVersion: false,
          platform: false,
        },
      });
      config.appVersion = '1.0.0';
      await context.setup(config);

      const event: Event = {
        id: 'uuid',
        eventType: AvailableEventType.TRACK,
        eventName: 'eventName',
      };
      const firstContextEvent = await context.execute(event);
      expect(firstContextEvent.eventName).toEqual('eventName');
      expect(firstContextEvent.properties?.$appVersion).toEqual('1.0.0');
      expect(firstContextEvent.properties?.$platform).toBeUndefined();
      expect(firstContextEvent.properties?.$osName).toBeUndefined();
      expect(firstContextEvent.properties?.$osVersion).toBeUndefined();
      expect(firstContextEvent.properties?.$language).toBeUndefined();
      expect(firstContextEvent.properties?.$ip).toBeUndefined();
      expect(firstContextEvent.properties?.$distinctId).toBeDefined();
      expect(firstContextEvent.properties?.$time).toBeDefined();
      expect(firstContextEvent.properties?.$deviceId).toEqual('deviceId');
      expect(firstContextEvent.properties?.$sessionId).toEqual(1);
      expect(firstContextEvent.properties?.$userId).toEqual('user@coxwave.com');
    });

    test('should be overwritten by the context', async () => {
      const context = new Context();
      jest.spyOn(context, 'isSessionValid').mockReturnValue(true);
      const config = useDefaultConfig('user@coxwave.com', {
        deviceId: 'deviceId',
        sessionId: 1,
      });
      config.appVersion = '1.0.0';
      await context.setup(config);

      const event: Event = {
        id: 'uuid',
        eventType: AvailableEventType.TRACK,
        eventName: 'eventName',
        properties: { $deviceId: 'new deviceId' },
      };
      const firstContextEvent = await context.execute(event);
      expect(firstContextEvent.eventName).toEqual('eventName');
      expect(firstContextEvent.properties?.$appVersion).toEqual('1.0.0');
      expect(firstContextEvent.properties?.$deviceId).toEqual('new deviceId');
    });

    test('should create new session', async () => {
      const plugin = new Context();
      jest.spyOn(plugin, 'isSessionValid').mockReturnValue(false);
      const config = useDefaultConfig('user@coxwave.com', {
        sessionId: 1,
      });
      await plugin.setup(config);
      const context = {
        id: 'uuid',
        eventType: AvailableEventType.TRACK,
        eventName: 'eventName',
        device_id: 'new deviceId',
      };
      const event = await plugin.execute(context);
      expect(event.properties?.sessionId).not.toBe(1);
    });
  });
});
