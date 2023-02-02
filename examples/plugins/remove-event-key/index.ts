import { createInstance } from '@coxwave/analytics-browser';
import { EnrichmentPlugin, PluginCoverage, PluginType } from '@coxwave/analytics-types';
import { PredefinedProperties } from '@coxwave/analytics-types/src';

type KeyOfEvent = keyof PredefinedProperties;

/**
 * This is an example plugin that enriches all events by removing a list of keys from the
 * event payload. This plugin is helpful in cases where users prefer not to use default
 * values set by the @coxwave/analytics-browser library, for example:
 * - `event.ip`
 *
 * @param keysToRemove
 * @returns EnrichmentPlugin
 */
export const removeEventKeyEnrichment = (keysToRemove: KeyOfEvent[] = []): EnrichmentPlugin => {
  return {
    name: 'remove-event-key-enrichment',
    type: PluginType.ENRICHMENT,
    coverage: PluginCoverage.ALL,

    setup: async () => undefined,
    execute: async (event) => {
      if (event.properties) {
        for (var key of keysToRemove) {
          delete event.properties[key];
        }
      }
      return event;
    },
  };
};

/**
 * This is an example plugin that enriches all events by removing `event.time` from all events.
 * `event.time` uses `Date.now()` which is controlled by the device where the browser runs on.
 * The device clock can be easily manipulated yielding events having unreasonable time values.
 * With `event.time` being `undefined`, the time of the event is determined when the event was sent
 * successfully by the browser ("Client Upload Time"), determined by the server clock, rather than
 * when the event actually occurred. On majority of the cases, "Client Upload Time" can be
 * off by up to the configured `config.flushIntervalMillis`. By default `config.flushIntervalMillis`
 * is set to 1000 milliseconds. In rare cases where initial request to Amplitude fails due to
 * bad payload, throttled request, server error, etc, the time difference can be extended.
 */
const removeTimeEnrichment = removeEventKeyEnrichment(['$ip']);

const instance = createInstance();

/**
 * IMPORTANT: install plugin before calling init to make sure plugin is added by the time
 * init function is called, and events are flushed.
 */
instance.add(removeTimeEnrichment);

// initialize sdk
instance.init('PROJECT_TOKEN');
