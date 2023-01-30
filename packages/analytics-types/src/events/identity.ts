import { BaseEvent, TSpecialEventName, ValidPropertyType } from './base-event';

export const SpecialIdentifyPropertyKey = ['$name', '$email', '$city', '$region', '$country', '$language'] as const;
export type TSpecialIdentifyPropertyKey = (typeof SpecialIdentifyPropertyKey)[number];

export interface IdentifyUserProperties {
  [key: string]: ValidPropertyType;
}

export interface Identify {
  getUserProperties(): IdentifyUserProperties;
  set(property: string, value: ValidPropertyType): Identify;
}

// TODO: Only support for SET for now.
export enum IdentifyOperation {
  SET = '$set',
}

export interface IdentifyRegisterEvent extends BaseEvent {
  eventName: TSpecialEventName;
  distinctId: string;
}

export interface IdentifyUserEvent extends BaseEvent {
  eventName: TSpecialEventName;
  alias: string;
}

export interface IdentifyAliasEvent extends BaseEvent {
  eventName: TSpecialEventName;
  alias: string;
  distinctId: string;
}
