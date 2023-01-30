export const AvailableEventType = {
  TRACK: '$track',
  LOG: '$log',
  FEEDBACK: '$feedback',
  IDENTIFY: '$identify',
} as const;
export type TAvailableEventType = (typeof AvailableEventType)[keyof typeof AvailableEventType];

export const SpecialEventName = {
  REGISTER: '$register',
  IDENTIFY: '$identify',
  ALIAS: '$alias',
} as const;
export type TSpecialEventName = (typeof SpecialEventName)[keyof typeof SpecialEventName];

export interface BaseEvent {
  id: string;
  eventType: TAvailableEventType;
  eventName: string;
  properties?: PredefinedProperties & { [key: string]: any };
}

export interface PredefinedProperties {
  // default options
  $distinctId?: string;
  $time?: number;
  $library?: string;
  $sessionId?: number;
  $threadId?: string; // uuid only
  // user & device related options
  $userId?: string;
  $deviceId?: string;
  $appVersion?: string;
  $versionName?: string;
  $platform?: string;
  $osName?: string;
  $osVersion?: string;
  $deviceBrand?: string;
  $deviceManufacturer?: string;
  $deviceModel?: string;
  // location related options
  $locationLat?: number;
  $locationLng?: number;
  $ip?: string;
  // Identify properties
  $name?: string;
  $email?: string;
  $city?: string;
  $region?: string;
  $country?: string;
  $language?: string;
}

export type ValidPropertyType =
  | number
  | string
  | boolean
  | Array<string | number>
  | { [key: string]: ValidPropertyType };
