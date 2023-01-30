import { Event } from './events';

export interface Result {
  id: string;
  event: Event;
  code: number;
  message: string;
  body: Record<string, number | string>;
}
