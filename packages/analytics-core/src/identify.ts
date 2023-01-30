import { ValidPropertyType, Identify as IIdentify, IdentifyUserProperties } from '@coxwave/analytics-types';

import { isValidProperties } from './utils/valid-properties';

export class Identify implements IIdentify {
  protected readonly _propertySet: Set<string> = new Set<string>();
  protected _properties: IdentifyUserProperties = {};

  public getUserProperties(): IdentifyUserProperties {
    return { ...this._properties };
  }

  public set(property: string, value: ValidPropertyType): IIdentify {
    if (this._validate('$set', property, value)) {
      this._properties[property] = value;
    }
    return this;
  }

  private _validate(_operation: string, property: string, value: ValidPropertyType): boolean {
    if (this._propertySet.has(property)) {
      return false;
    }
    return isValidProperties(property, value);
  }
}
