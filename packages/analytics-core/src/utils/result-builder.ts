import { Event, Result, Status } from '@coxwave/analytics-types';

export const buildResult = (
  event: Event,
  code = 0,
  message: string = Status.Unknown,
  body: Record<string, number | string> = {},
): Result => {
  return { id: event.id, event, code, message, body };
};
