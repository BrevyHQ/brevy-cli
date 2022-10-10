export type None = null | undefined;
export type Maybe<T> = T | None;

export function isNone<T>(val: Maybe<T>): val is None {
  return val === null || val === undefined;
}

export function isSome<T>(val: Maybe<T>): val is T {
  return isNone(val) === false;
}

export function exists<T>(val: Maybe<T>): val is T {
  return isNone(val) === false;
}

export function mustExist<T>(val: Maybe<T>, err?: string): T {
  if (isNone(val)) {
    throw new Error(err || 'Value must exist!');
  }

  return val;
}
