import { ActivityEvent, FeedbackEvent, GenerationEvent, ValidPropertyType } from './events';

export interface PayloadOptions {
  [key: string]: any;
}

export interface ActivityPayload {
  activities: readonly ActivityEvent[];
  options?: PayloadOptions;
}

export interface GenerationPayload {
  generations: readonly GenerationEvent[];
  options?: PayloadOptions;
}

export interface FeedbackPayload {
  feedbacks: readonly FeedbackEvent[];
  options?: PayloadOptions;
}

// TODO: will be refactored
export interface IdentifyPayload {
  alias?: string;
  distinctId?: string;
  name?: string;
  email?: string;
  city?: string;
  region?: string;
  country?: string;
  language?: string;
  custom?: ValidPropertyType;
}

export type Payload = ActivityPayload | GenerationPayload | FeedbackPayload | IdentifyPayload;
