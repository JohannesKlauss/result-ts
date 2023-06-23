import {
  AndThenResolver,
  AsyncAndThenResolver,
  AsyncMapOrResolver,
  AsyncMapResolver,
  AsyncOrResolver,
  MapOrResolver,
  MapResolver,
  OrResolver,
  ResultBase,
} from './ResultBase'
import { AsyncResult, Result } from '../types'
import { OkImpl } from './OkImpl'

export class ErrImpl<E> extends ResultBase<never, E> {
  readonly kind: 'Err' = 'Err'

  readonly ok: boolean = false

  readonly err: boolean = true

  constructor(readonly error: E) {
    super()
  }

  isOk(): this is OkImpl<never> {
    return false
  }

  isErr(): this is ErrImpl<E> {
    return true
  }

  unwrap(): E {
    return this.error
  }

  unwrapOr(_defaultValue: never): never {
    throw this.error
  }

  map<U>(_fn: MapResolver<never, U>): ErrImpl<E> {
    return this
  }

  async mapAsync<U>(_fn: AsyncMapResolver<never, U>): Promise<ErrImpl<E>> {
    return this
  }

  mapOr<U>(_fn: MapOrResolver<never, U>, fallback: U): OkImpl<U> {
    return new OkImpl(fallback)
  }

  async mapOrAsync<U>(
    _fn: AsyncMapOrResolver<never, U>,
    fallback: U,
  ): Promise<OkImpl<U>> {
    return new OkImpl(fallback)
  }

  or(alternative: OrResolver<never, E>): Result<never, E> {
    if (typeof alternative === 'function') {
      return alternative()
    }
    return alternative
  }

  async orAsync(alternative: AsyncOrResolver<never, E>): AsyncResult<never, E> {
    if (typeof alternative === 'function') {
      return alternative()
    }
    return alternative
  }

  andThen<U>(_fn: AndThenResolver<never, U, E>): ErrImpl<E> {
    return this
  }

  async andThenAsync<U>(
    _fn: AsyncAndThenResolver<never, U, E>,
  ): Promise<ErrImpl<E>> {
    return this
  }
}

export const Err = ErrImpl as typeof ErrImpl & (<E>(err: E) => Err<E>)
export type Err<E> = ErrImpl<E>
