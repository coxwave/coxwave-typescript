import { TStatus } from './status';

export interface SuccessBody {
  eventsIngested: number;
  payloadSizeBytes: number;
  serverUploadTime: number;
}

export interface InvalidRequestBody {
  error: string;
  missingField: string;
  eventsWithInvalidFields: { [eventField: string]: number[] };
  eventsWithMissingFields: { [eventField: string]: number[] };
  eventsWithInvalidIdLengths: { [eventField: string]: number[] };
  epsThreshold: 0;
  exceededDailyQuotaDevices: { [deviceId: string]: number };
  silencedDevices: string[];
  silencedEvents: number[];
  throttledDevices: { [deviceId: string]: number };
  throttledEvents: number[];
}

export interface PayloadTooLargeBody {
  error: string;
}

export interface RateLimitBody {
  error: string;
  epsThreshold: number;
  throttledDevices: { [deviceId: string]: number };
  throttledUsers: { [distinctId: string]: number };
  exceededDailyQuotaDevices: { [deviceId: string]: number };
  exceededDailyQuotaUsers: { [distinctId: string]: number };
  throttledEvents: number[];
}

export interface SuccessResponse {
  status: TStatus['Success'];
  statusCode: number;
  body: SuccessBody;
}

export interface InvalidResponse {
  status: TStatus['Invalid'];
  statusCode: number;
  body: InvalidRequestBody;
}

export interface PayloadTooLargeResponse {
  status: TStatus['PayloadTooLarge'];
  statusCode: number;
  body: PayloadTooLargeBody;
}

export interface RateLimitResponse {
  status: TStatus['RateLimit'];
  statusCode: number;
  body: RateLimitBody;
}

export interface TimeoutResponse {
  status: TStatus['Timeout'];
  statusCode: number;
}

export type StatusWithResponseBody =
  | TStatus['Invalid']
  | TStatus['PayloadTooLarge']
  | TStatus['RateLimit']
  | TStatus['Success'];

export interface OtherReponse {
  status: Exclude<TStatus, StatusWithResponseBody>;
  statusCode: number;
}

export type Response =
  | SuccessResponse
  | InvalidResponse
  | PayloadTooLargeResponse
  | RateLimitResponse
  | TimeoutResponse
  | OtherReponse;
