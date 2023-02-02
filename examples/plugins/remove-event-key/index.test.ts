import { AvailableEventType, Event } from '@coxwave/analytics-types';
import { removeEventKeyEnrichment } from './';

describe('remove-event-key-enrichment', () => {
  describe('execute', () => {
    test('should remove keys from event payload', async () => {
      const plugin = removeEventKeyEnrichment(['$ip']);
      const mockEvent: Event = {
        id: 'uuid',
        eventType: AvailableEventType.TRACK,
        eventName: 'Custom Event',
        properties: {
          $ip: '222.222.222.222',
        },
      };
      const result = await plugin.execute(mockEvent);
      expect(result.properties?.$ip).toBeUndefined();
    });

    test('should not remove keys from event payload', async () => {
      const plugin = removeEventKeyEnrichment();
      const mockEvent: Event = {
        id: 'uuid',
        eventType: AvailableEventType.TRACK,
        eventName: 'Custom Event',
        properties: {
          $ip: '222.222.222.222',
        },
      };
      const result = await plugin.execute(mockEvent);
      expect(result.properties?.$ip).toBeDefined();
    });
  });
});
