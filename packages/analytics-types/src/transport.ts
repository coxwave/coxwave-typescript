import { Payload } from './payload';
import { Response } from './response';

export interface Transport {
  send(serverUrl: string, payload: Payload, projectToken: string): Promise<Response | null>;
}

export const TransportType = {
  XHR: 'xhr',
  Fetch: 'fetch',
} as const;
export type TTransportType = (typeof TransportType)[keyof typeof TransportType];
