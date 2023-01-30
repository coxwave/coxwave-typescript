export interface CoxwaveReturn<T> {
  promise: Promise<T>;
}

export interface CoxwaveReturnWithId<T> {
  id: string;
  promise: Promise<T>;
}
