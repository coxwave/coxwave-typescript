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

export interface BaseResponse {
  status: TStatus;
  statusCode: number;
  body?: Record<string, any>;
}

export interface SuccessResponse extends BaseResponse {
  status: 'success';
  statusCode: number;
  body: SuccessBody;
}

export interface InvalidResponse extends BaseResponse {
  status: 'invalid';
  statusCode: number;
  body: InvalidRequestBody;
}

export interface PayloadTooLargeResponse extends BaseResponse {
  status: 'payload_too_large';
  statusCode: number;
  body: PayloadTooLargeBody;
}

export interface RateLimitResponse extends BaseResponse {
  status: 'rate_limit';
  statusCode: number;
  body: RateLimitBody;
}

export interface TimeoutResponse extends BaseResponse {
  status: 'timeout';
  statusCode: number;
}

export type StatusWithResponseBody = 'invalid' | 'payload_too_large' | 'rate_limit' | 'success';

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
