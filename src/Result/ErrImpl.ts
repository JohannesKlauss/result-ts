import {
  FlatMapResolver, MapErrResolver,
  MapResolver,
  OrResolver,
  ResultBase,
} from './ResultBase'
import {AsyncResult, Result} from '../types'
import { OkImpl } from './OkImpl'

export class ErrImpl<E> extends ResultBase<never, E> {
  private readonly valuePromise: Promise<E>

  constructor(value: Promise<E> | E) {
    super()
    this.valuePromise = Promise.resolve(value)
  }

  get kind() {
    return 'Err' as const
  }

  get ok() {
    return false
  }

  get err() {
    return true
  }

  isOk(): this is never {
    return false
  }

  isErr(): this is ErrImpl<E> {
    return true
  }

  unwrap(): never {
    throw new Error('Called unwrap on Err value')
  }

  unwrapErr(): Promise<E> {
    return this.valuePromise
  }

  unwrapOr<T>(defaultValue: T): Promise<T> {
    return Promise.resolve(defaultValue)
  }

  map<U>(fn: MapResolver<never, U>): ErrImpl<E> {
    return this
  }

  mapErr<F>(fn: MapErrResolver<E, F>): ErrImpl<F> {
    return new ErrImpl(this.valuePromise.then(fn))
  }

  mapOr<U>(fn: MapResolver<never, U>, defaultValue: U): OkImpl<U> {
    return new OkImpl(defaultValue)
  }

  or<U>(alternative: OrResolver<U, E>): Result<U, E> {
    return typeof alternative === 'function' ? alternative() : alternative
  }

  flatMap(fn: FlatMapResolver<never, never, never>): Result<never, E> {
    return this
  }
}

export const Err = ErrImpl as typeof ErrImpl & (<E>(err: E) => Err<E>)
export type Err<E> = ErrImpl<E>
