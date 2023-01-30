import { BaseEvent } from './base-event';

export const SpecialActivityPropertyKey = [] as const;
export type TSpecialActivityPropertyKey = (typeof SpecialActivityPropertyKey)[number];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActivityProperties extends Record<string, any> {}
export interface ActivityEvent extends BaseEvent, ActivityProperties {}
