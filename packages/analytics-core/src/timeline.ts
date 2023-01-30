import {
  AvailableEventType,
  BeforePlugin,
  Config,
  DestinationPlugin,
  EnrichmentPlugin,
  Event,
  EventCallback,
  Plugin,
  PluginType,
  Result,
  PluginCoverage,
  TPluginCoverage,
} from '@coxwave/analytics-types';

import { buildResult } from './utils/result-builder';

export class Timeline {
  queue: [Event, EventCallback][] = [];
  // Flag to guarantee one schedule apply is running
  applying = false;
  // Flag indicates whether timeline is ready to process event
  // Events collected before timeline is ready will stay in the queue to be processed later
  plugins: Plugin[] = [];

  async register(plugin: Plugin, config: Config) {
    await plugin.setup(config);
    this.plugins.push(plugin);
  }

  deregister(pluginName: string) {
    this.plugins.splice(
      this.plugins.findIndex((plugin) => plugin.name === pluginName),
      1,
    );
    return Promise.resolve();
  }

  reset() {
    this.applying = false;
    this.plugins = [];
  }

  push(event: Event) {
    return new Promise<Result>((resolve) => {
      this.queue.push([event, resolve]);
      this.scheduleApply(0);
    });
  }

  scheduleApply(timeout: number) {
    if (this.applying) return;
    this.applying = true;
    setTimeout(() => {
      void this.apply(this.queue.shift()).then(() => {
        this.applying = false;
        if (this.queue.length > 0) {
          this.scheduleApply(0);
        }
      });
    }, timeout);
  }

  async apply(item: [Event, EventCallback] | undefined) {
    if (!item) {
      return;
    }

    let [event] = item;
    const [, resolve] = item;

    const before = this.plugins.filter<BeforePlugin>(
      (plugin: Plugin): plugin is BeforePlugin => plugin.type === PluginType.BEFORE,
    );

    for (const plugin of before) {
      event = await plugin.execute({ ...event });
    }

    const enrichment = this.plugins.filter<EnrichmentPlugin>(
      (plugin: Plugin): plugin is EnrichmentPlugin => plugin.type === PluginType.ENRICHMENT,
    );

    for (const plugin of enrichment) {
      event = await plugin.execute({ ...event });
    }

    switch (event.eventType) {
      case AvailableEventType.TRACK:
        this._executeDestination(PluginCoverage.ACTIVITY, event, resolve);
        break;
      case AvailableEventType.LOG:
        this._executeDestination(PluginCoverage.GENERATION, event, resolve);
        break;
      case AvailableEventType.FEEDBACK:
        this._executeDestination(PluginCoverage.FEEDBACK, event, resolve);
        break;
      case AvailableEventType.IDENTIFY:
        this._executeDestination(PluginCoverage.IDENTIFY, event, resolve);
        break;
      default:
        resolve(buildResult(event, 500, 'Event type not supported'));
    }

    return;
  }

  private _executeDestination<T extends DestinationPlugin>(
    coverage: TPluginCoverage,
    event: Event,
    resolve: EventCallback,
  ) {
    const destination = this.plugins.filter<T>((plugin: Plugin): plugin is T => plugin.coverage === coverage);

    const executeDestinations = destination.map((plugin) => {
      const eventClone = { ...event };
      return plugin.execute(eventClone).catch((e) => buildResult(eventClone, 0, String(e)));
    });

    void Promise.all(executeDestinations).then(([result]) => {
      resolve(result);
    });
  }

  async flush() {
    const queue = this.queue;
    this.queue = [];

    await Promise.all(queue.map((item) => this.apply(item)));

    await this._flushDestination(PluginCoverage.ACTIVITY);
    await this._flushDestination(PluginCoverage.GENERATION);
    await this._flushDestination(PluginCoverage.FEEDBACK);
    await this._flushDestination(PluginCoverage.IDENTIFY);
  }

  private async _flushDestination<T extends DestinationPlugin>(coverage: TPluginCoverage) {
    const destination = this.plugins.filter<T>((plugin: Plugin): plugin is T => plugin.coverage === coverage);

    const executeDestinations = destination.map((plugin) => {
      return plugin.flush && plugin.flush();
    });

    await Promise.all(executeDestinations);
  }
}
