import { BaseEvent } from './base-event';

export const SpecialFeedbackPropertyKey = ['generationId'] as const;
export type TSpecialFeedbackPropertyKey = (typeof SpecialFeedbackPropertyKey)[number];

export interface FeedbackProperties extends Record<string, any> {
  generationId: string;
}

export interface FeedbackEvent extends BaseEvent, FeedbackProperties {}
