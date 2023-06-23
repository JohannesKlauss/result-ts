import {
  AndThenResolver, AsyncAndThenResolver, AsyncMapOrResolver, AsyncMapResolver,
  MapOrResolver,
  MapResolver,
  ResultBase,
} from './ResultBase'
import { AsyncResult, Result } from '../types'
import { ErrImpl } from './ErrImpl'

export class OkImpl<T> extends ResultBase<T, never> {
  readonly kind: 'Ok' = 'Ok'

  readonly ok: boolean = true

  readonly err: boolean = false

  constructor(readonly value: T) {
    super()
  }

  isOk(): this is OkImpl<T> {
    return true
  }

  isErr(): this is ErrImpl<never> {
    return false
  }

  unwrap(): T {
    return this.value
  }

  unwrapOr(_defaultValue: T): T {
    return this.value
  }

  map<U, E>(fn: MapResolver<T, U>): OkImpl<U> {
    return new OkImpl(fn(this.value))
  }

  async mapAsync<U, E>(fn: AsyncMapResolver<T, U>): Promise<OkImpl<U>> {
    return new OkImpl(await fn(this.value))
  }

  mapOr<U, E>(fn: MapOrResolver<T, U>, _fallback: U): OkImpl<U> {
    return new OkImpl(fn(this.value))
  }

  async mapOrAsync<U, E>(
    fn: AsyncMapOrResolver<T, U>,
    _fallback: U
  ): Promise<OkImpl<U>> {
    return new OkImpl(await fn(this.value))
  }

  or(_alternative: unknown): OkImpl<T> {
    return this
  }

  async orAsync(_alternative: unknown): Promise<OkImpl<T>> {
    return this
  }

  andThen<U, E>(fn: AndThenResolver<T, U, E>): Result<U, E> {
    return fn(this.value)
  }

  async andThenAsync<U, E>(fn: AsyncAndThenResolver<T, U, E>): AsyncResult<U, E> {
    return fn(this.value)
  }
}

export const Ok = OkImpl as typeof OkImpl & (<T>(val: T) => Ok<T>)
export type Ok<T> = OkImpl<T>
