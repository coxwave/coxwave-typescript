import { CoxwaveReturn, CoxwaveReturnWithId } from '../coxwave-promise';
import { ActivityProperties, FeedbackProperties, GenerationProperties, PredefinedProperties } from '../events';
import { Identify } from '../events';
import { Plugin } from '../plugin';
import { Result } from '../result';

export interface BaseClient {
  /**
   * Adds a new plugin.
   * Plugin has 3 types: `ENRICHMENT`, `PROCESSING`, `DESTINATION`.
   * and has 5 coverages: `ALL`, `ACTIVITIES`, `GENERATIONS`, `FEEDBACK`, `IDENTIFY`.
   *
   * ```typescript
   * const plugin = {
   *   name: 'myPlugin',
   *   type: PluginType.ENRICHMENT,
   *   coverage: PluginCoverage.ALL,
   *   setup(config: Config) {
   *     return;
   *   },
   *   execute(context: Event) {
   *     return context;
   *   },
   * };
   * coxwave.add(plugin);
   * ```
   */
  add(plugin: Plugin): CoxwaveReturn<void>;

  /**
   * Removes a plugin.
   *
   * ```typescript
   * coxwave.remove('myPlugin');
   * ```
   */
  remove(pluginName: string): CoxwaveReturn<void>;

  /**
   * Tracks user-defined activity, with specified name, activity properties and predefinedProperties.
   *
   * ```typescript
   * // activity tracking with activity name only
   * track('Page Load');
   *
   * // activity tracking with activity name and additional activity properties
   * track('Page Load', { loadTime: 1000 });
   *
   * // activity tracking with activity name, additional activity properties and predefinedProperties
   * track('Page Load', { loadTime: 1000 }, { userId: "joowon.kim" });
   *
   * // alternatively, this method is awaitable
   * const result = await track('Page Load').promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "User Activity tracked successfully"
   * ```
   */
  track(
    activityName: string,
    activityProperties?: ActivityProperties,
    predefinedProperties?: PredefinedProperties,
  ): CoxwaveReturnWithId<Result>;

  /**
   * Logs model generations, with specified name, generation properties and predefinedProperties.
   *
   * ```typescript
   * // generation logging with generation name only
   * log('Blog-Contents');
   *
   * // generation logging with generation name and additional gneration properties
   * log(
   *  'Blog-Contents',
   *  {
   *    input: { foo: { type: "text", value: "hello world" }},
   *    output: { bar: { type: "text", value: "hello world" }}
   *  },
   * );
   *
   * // generation logging with generation name, additional generation properties and predefinedProperties
   * log(
   *  'Blog-Contents',
   *  {
   *    input: { foo: { type: "text", value: "hello world" }},
   *    output: { bar: { type: "text", value: "hello world" }}
   *  },
   *  { userId: "joowon.kim" }
   * );
   *
   * // alternatively, this method is awaitable
   * const result = await log('Blog-Contents').promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Event logged successfully"
   * ```
   */
  log(
    generationName: string,
    generationProperties?: GenerationProperties,
    predefinedProperties?: PredefinedProperties,
  ): CoxwaveReturnWithId<Result>;

  /**
   * Feedbacks, with specified name, feedback properties and PredefinedEventProperties.
   *
   * ```typescript
   * // feedback feedback with generation_id and feedback name
   * feedback('Thumbs-Up', { generationId: <generation_id> });
   *
   * // feedback feedback with generation_id, feedback name and additional feedback properties
   * feedback('rating', { generationId: <generation_id>, score: 5 });
   *
   * // feedback feedback with generation_id, feedback name, additional feedback properties, and PredefinedEventProperties
   * feedback('rating', { generationId: <generation_id>, score: 5 }, { userId: "joowon.kim" });
   *
   * // alternatively, this method is awaitable
   * const result = await feedback('Thumbs-Up', { generationId: <generation_id> }).promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Feedback successfully"
   * ```
   */
  feedback(
    feedbackName: string,
    feedbackProperties?: FeedbackProperties,
    predefinedProperties?: PredefinedProperties,
  ): CoxwaveReturnWithId<Result>;

  /**
   * Sends an register event for notifying new distinctId to coxwave.
   *
   * ```typescript
   * register(id);
   *
   * // alternatively, this tracking method is awaitable
   * const result = await register(id).promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Event tracked successfully"
   * ```
   */
  register(distinctId: string): CoxwaveReturn<Result>;

  /**
   * Sends an identify event containing user property operations
   *
   * ```typescript
   * const id = new Identify();
   * id.set('colors', ['rose', 'gold']);
   * id.set('colors', ['$city', 'Seoul']);
   *
   * // alternatively, this tracking method is awaitable
   * const result = await identify("joowon.kim", id).promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Event tracked successfully"
   * ```
   */
  identify(alias: string, identify: Identify, predefinedProperties?: PredefinedProperties): CoxwaveReturn<Result>;

  /**
   * TODO: change docs here
   * Sends an alias event for connecting alias with distinctId
   *
   * ```typescript
   * alias("joowon.kim", <distinct_id>);
   *
   * // alternatively, this tracking method is awaitable
   * const result = await alias("joowon.kim", <distinct_id>)).promise;
   * console.log(result.event); // {...}
   * console.log(result.code); // 200
   * console.log(result.message); // "Event tracked successfully"
   * ```
   */
  alias(alias: string, distinctId?: string): CoxwaveReturn<Result>;

  /**
   * Sets a new optOut config value. This toggles event tracking on/off.
   *
   *```typescript
   * // Stops tracking
   * setOptOut(true);
   *
   * // Starts/resumes tracking
   * setOptOut(false);
   * ```
   */
  setOptOut(optOut: boolean): void;

  /**
   * Flush all unsent events.
   *
   *```typescript
   * flush();
   * ```
   */
  flush(): CoxwaveReturn<void>;
}
