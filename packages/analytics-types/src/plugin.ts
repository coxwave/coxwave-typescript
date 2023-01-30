import { Config } from './config';
import { Event } from './events';
import { Result } from './result';

export const PluginType = {
  BEFORE: 'before',
  ENRICHMENT: 'enrichment',
  DESTINATION: 'destination',
} as const;
export type TPluginType = (typeof PluginType)[keyof typeof PluginType];

export const PluginCoverage = {
  ALL: 'all',
  ACTIVITY: 'activity',
  GENERATION: 'generation',
  FEEDBACK: 'feedback',
  IDENTIFY: 'identify',
} as const;
export type TPluginCoverage = (typeof PluginCoverage)[keyof typeof PluginCoverage];

export interface BeforePlugin {
  name: string;
  type: TPluginType;
  coverage: TPluginCoverage;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Event>;
}

export interface EnrichmentPlugin {
  name: string;
  type: TPluginType;
  coverage: TPluginCoverage;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Event>;
}

export interface DestinationPlugin {
  name: string;
  type: TPluginType;
  coverage: TPluginCoverage;
  setup(config: Config): Promise<void>;
  execute(context: Event): Promise<Result>;
  flush?(): Promise<void>;
}

export type Plugin = BeforePlugin | EnrichmentPlugin | DestinationPlugin;
