import {
  FlatMapResolver,
  MapErrResolver,
  MapOrResolver,
  MapResolver,
  OrResolver,
  ResultBase,
} from './ResultBase'
import { Result } from '../types'
import { ErrImpl } from './ErrImpl'

export class OkImpl<T> extends ResultBase<T, never> {
  private readonly valuePromise: Promise<T>

  constructor(value: Promise<T> | T) {
    super()
    this.valuePromise = Promise.resolve(value)
  }

  get kind() {
    return 'Ok' as const
  }

  get ok() {
    return true
  }

  get err() {
    return false
  }

  isOk(): this is OkImpl<T> {
    return true
  }

  isErr(): this is never {
    return false
  }

  unwrap(): Promise<T> {
    return this.valuePromise
  }

  unwrapErr(): Promise<never> {
    throw new Error('Called unwrapErr on Ok value')
  }

  unwrapOr(defaultValue: T): Promise<T> {
    return this.valuePromise
  }

  map<U, E>(fn: MapResolver<T, U>): OkImpl<U> {
    // TODO: IS IT EVEN POSSIBLE TO SWITCH TO AN ERROR STATE HERE? SINCE WE CANNOT WAIT FOR THE PROMISE TO RESOLVE, WE DON'T KNOW WHAT THE STATE WILL BE
    return new OkImpl(this.valuePromise.then(fn))
  }

  mapErr<F>(fn: MapErrResolver<never, F>): OkImpl<T> {
    return this
  }

  mapOr<U>(fn: MapOrResolver<T, U>, defaultValue: U): Result<U, never> {
    return new OkImpl(this.valuePromise.then(fn))
  }

  or(alternative: OrResolver<T, never>): Result<T, never> {
    return new OkImpl(this.valuePromise)
  }

  flatMap<U, F>(fn: FlatMapResolver<T, U, F>): Result<U, F> {
    // TODO: NOT SURE HOW TO SOLVE THIS. IF WE WANT TO RETURN A RESULT WE WOULD ALSO HAVE TO AWAIT THE PROMISE WHICH WE CANNOT DO HERE.
    return this.valuePromise.then(fn).then(async (result) => {
      if (result instanceof OkImpl) {
        return new OkImpl(result.unwrap())
      } else {
        return new ErrImpl(result.unwrapErr())
      }
    })
  }
}

export const Ok = OkImpl as typeof OkImpl & (<T>(val: T) => Ok<T>)
export type Ok<T> = OkImpl<T>
