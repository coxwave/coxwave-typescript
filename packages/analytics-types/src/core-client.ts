import { Config } from './config';
import { ActivityProperties, FeedbackProperties, GenerationProperties, PredefinedProperties } from './events';
import { Result } from './result';

export interface CoreClient<T extends Config> {
  config: T;

  track(
    activityName: string,
    activityProperties?: ActivityProperties,
    predefinedProperties?: PredefinedProperties,
  ): { id: string; promise: Promise<Result> };

  log(
    generationName: string,
    generationProperties?: GenerationProperties,
    predefinedProperties?: PredefinedProperties,
  ): { id: string; promise: Promise<Result> };

  feedback(
    feedbackName: string,
    feedbackProperties: FeedbackProperties,
    predefinedProperties?: PredefinedProperties,
  ): { id: string; promise: Promise<Result> };
}
